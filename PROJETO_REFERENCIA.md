# Referência de Padrão de Projeto — App React Native (Expo + AdMob)

> Documento gerado a partir do projeto **Converte Já** (`com.convertejaapp.app`).
> Use como base e checklist ao iniciar um novo projeto React Native com Expo e monetização AdMob.

---

## Stack

| Camada | Tecnologia | Versão |
|---|---|---|
| Framework | Expo (managed workflow) | ~57.0.1 |
| Runtime | expo-dev-client | ^57.0.3 |
| UI | React Native | 0.86.0 |
| Linguagem | TypeScript | ~6.0.3 |
| Ads | react-native-google-mobile-ads | ^16.0.0 |
| Storage | @react-native-async-storage/async-storage | 2.2.0 |
| Build | EAS Build (Expo Application Services) | >= 20.0.0 |

> **Atenção:** `react-native-google-mobile-ads` deve ser fixado sem `^` se houver conflito de Kotlin com o SDK do Expo. Ex: `"react-native-google-mobile-ads": "16.0.0"`.

---

## Estrutura de Pastas

```
/
├── assets/                         # Ícones, imagens e assets da loja
│   ├── icon.png                    # Ícone do app (1024x1024)
│   ├── android-icon-foreground.png # Camada foreground do adaptive icon
│   ├── android-icon-background.png # Camada background do adaptive icon
│   ├── android-icon-monochrome.png # Versão monocromática
│   ├── icon-playstore-512.png      # Ícone para Play Store (512x512)
│   ├── feature-graphic-1024x500.png# Feature graphic Play Store
│   └── screenshots/                # Capturas de tela para a ficha da loja
│       ├── screen1.png
│       ├── screen2.png
│       └── screen3.png
│
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx          # Tela inicial — grade de categorias
│   │   └── ConverterScreen.tsx     # Tela de conversão — input/output + troca de unidade
│   ├── hooks/
│   │   ├── useInterstitialAd.ts    # Hook: interstitial com frequência configurável
│   │   └── useRewardedAd.ts        # Hook: rewarded ad para remoção temporária de anúncios
│   └── utils/
│       ├── adUnits.ts              # IDs de anúncio (dev/prod via __DEV__)
│       ├── adsState.ts             # Hook central de monetização (premium + reward)
│       ├── conversions.ts          # Lógica de conversão e definição de categorias/unidades
│       └── theme.ts                # Tokens de design (colors, spacing, radius)
│
├── app.json                        # Configuração do Expo
├── eas.json                        # Perfis de build (development/preview/production)
├── google-services.json            # APENAS LOCAL — não commitar
├── google-services.example.json    # Placeholder com variáveis — commitar no repo
└── .gitignore
```

---

## Design System (`src/utils/theme.ts`)

```ts
export const colors = {
  primary:        '#1565C0',
  primaryLight:   '#1E88E5',
  primaryDark:    '#0D47A1',
  accent:         '#42A5F5',
  background:     '#F5F7FA',
  surface:        '#FFFFFF',
  text:           '#1A1A2E',
  textSecondary:  '#5C6BC0',
  textMuted:      '#9E9E9E',
  border:         '#E3EAF5',
  success:        '#2E7D32',
  error:          '#C62828',
};

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
export const radius  = { sm: 8, md: 12, lg: 20 };
```

Todos os componentes importam `colors`, `spacing` e `radius` daqui. Nenhum valor hardcoded de cor ou espaçamento nos arquivos de componente.

---

## Monetização AdMob

### Estrutura de IDs (`src/utils/adUnits.ts`)

```ts
import { TestIds } from 'react-native-google-mobile-ads';

const PRODUCTION_BANNER_ID       = 'ca-app-pub-XXXX/YYYY';
const PRODUCTION_INTERSTITIAL_ID = 'ca-app-pub-XXXX/YYYY';
const PRODUCTION_REWARDED_ID     = 'ca-app-pub-XXXX/YYYY';

export const bannerAdUnitId       = __DEV__ ? TestIds.BANNER       : PRODUCTION_BANNER_ID;
export const interstitialAdUnitId = __DEV__ ? TestIds.INTERSTITIAL : PRODUCTION_INTERSTITIAL_ID;
export const rewardedAdUnitId     = __DEV__ ? TestIds.REWARDED     : PRODUCTION_REWARDED_ID;

export const INTERSTITIAL_FREQUENCY = 4;   // 1 interstitial a cada N ações
export const REWARD_DURATION_MS = 60 * 60 * 1000; // 1 hora sem anúncios
```

### Modelo de Monetização (3 camadas)

1. **Banner** — exibido na tela principal quando anúncios estão ativos
2. **Interstitial** — disparado a cada `INTERSTITIAL_FREQUENCY` trocas de categoria (moderação automática)
3. **Rewarded** — usuário assiste vídeo e remove anúncios por `REWARD_DURATION_MS`
4. **Premium** — compra única (scaffold pronto via `isPremium` + AsyncStorage)

### Hook central (`src/utils/adsState.ts`)

```ts
const { adsEnabled, isPremium, setPremium, rewardActive, grantTemporaryRemoval } = useAdsState();
```

- `adsEnabled` = `!isPremium && !rewardActive` — fonte única da verdade
- Estado persistido no AsyncStorage com chaves prefixadas: `@appslug:isPremium`, `@appslug:rewardExpiresAt`

---

## Configuração do App (`app.json`)

```json
{
  "expo": {
    "name": "Nome do App",
    "slug": "slug-do-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "userInterfaceStyle": "light",
    "android": {
      "package": "com.empresa.app",
      "adaptiveIcon": {
        "backgroundColor": "#1565C0",
        "foregroundImage": "./assets/android-icon-foreground.png"
      }
    },
    "plugins": [
      ["react-native-google-mobile-ads", {
        "androidAppId": "ca-app-pub-XXXX~YYYY",
        "iosAppId":     "ca-app-pub-XXXX~YYYY",
        "googleServicesFile": "./google-services.json"
      }],
      "expo-status-bar"
    ],
    "extra": {
      "eas": { "projectId": "UUID-DO-EAS-PROJECT" }
    },
    "owner": "username-expo"
  }
}
```

---

## EAS Build (`eas.json`)

```json
{
  "cli": { "version": ">= 20.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": { "buildType": "apk" }
    },
    "preview": {
      "distribution": "internal",
      "android": { "buildType": "apk" }
    },
    "production": {
      "android": { "buildType": "app-bundle" }
    }
  }
}
```

| Perfil | Saída | Uso |
|---|---|---|
| `development` | `.apk` | Dev com hot reload |
| `preview` | `.apk` | Teste interno |
| `production` | `.aab` | Upload para Play Store |

### Comandos de build

```bash
# Build de desenvolvimento (APK)
eas build --profile development --platform android

# Build de produção (AAB para Play Store)
eas build --profile production --platform android
```

---

## Segurança e Arquivos Sensíveis

### Regra absoluta: nunca commitar dados sensíveis

| Arquivo | Git | Local |
|---|---|---|
| `google-services.json` | ❌ `.gitignore` | ✅ apenas local |
| `GoogleService-Info.plist` | ❌ `.gitignore` | ✅ apenas local |
| `.env`, `.env.local` | ❌ `.gitignore` | ✅ apenas local |
| `*.jks`, `*.p12`, `*.key` | ❌ `.gitignore` | ✅ apenas local |
| `google-services.example.json` | ✅ commitar | — |

### Template `.gitignore` mínimo (adicionar ao padrão Expo)

```gitignore
# Firebase / AdMob — arquivos reais ficam apenas na máquina local
google-services.json
GoogleService-Info.plist

# Variáveis de ambiente
.env
.env*.local

# Keystores e certificados
*.jks
*.p12
*.key
*.mobileprovision
```

### Se um arquivo sensível for commitado por engano

1. `git rm --cached <arquivo>` — remove do tracking sem deletar localmente
2. Adicionar ao `.gitignore`
3. Rotacionar/invalidar a credencial exposta no painel do serviço (Firebase, Google Cloud, etc.)
4. Novo commit com a correção

---

## Assets para Play Store

| Asset | Dimensão | Formato |
|---|---|---|
| Ícone high-res | 512 × 512 px | PNG |
| Feature Graphic | 1024 × 500 px | PNG ou JPG |
| Screenshots (mín. 2) | ≥ 320 px de largura | PNG ou JPG |

- Screenshots capturadas de emulador têm banner de anúncio de teste — cortar os últimos ~160 px (1920→1760) antes de enviar
- Ícone adaptive Android: `foreground.png` com fundo transparente + `background.png` sólido

---

## Fluxo de Publicação na Play Store

1. **Criar conta Google Play Console** — taxa única US$25, exige verificação de identidade (1-3 dias úteis)
2. **Criar app** — categoria: Ferramentas, idioma: pt-BR, gratuito
3. **Produção → Criar nova versão** — upload do `.aab`
4. **Ficha da loja** — nome, descrição curta (≤80 chars), descrição longa (≤4000 chars), assets
5. **Classificação de conteúdo** — preencher questionário IARC
6. **Público-alvo** — definir faixa etária mínima
7. **Países** — selecionar mercados de distribuição
8. **Enviar para revisão** — primeira revisão costuma levar 1-7 dias

---

## Contas e IDs (preencher por projeto)

| Item | Valor |
|---|---|
| Expo owner | `username` |
| EAS Project ID | `UUID` |
| Bundle ID (Android) | `com.empresa.app` |
| AdMob App ID (Android) | `ca-app-pub-XXXX~YYYY` |
| AdMob App ID (iOS) | `ca-app-pub-XXXX~YYYY` |
| Firebase Project | `nome-projeto` |
| Play Console Account ID | `XXXX` |

---

## Lições Aprendidas

- **`react-native-google-mobile-ads` + Expo SDK 57**: fixar versão sem `^` para evitar conflito de Kotlin 2.1.0
- **`google-services.json` no Git**: causou rotação de chave de API — nunca commitar
- **Build de produção invalida após rotação de chave**: um novo build é necessário sempre que o `google-services.json` for atualizado
- **Emulador Android**: usar `adb reverse tcp:8081 tcp:8081` para conectar ao Metro. IP do host dentro do emulador é `10.0.2.2`
- **`__DEV__`**: flag automática do React Native — `true` em `expo start`, `false` em builds EAS production. Não precisa de configuração manual
- **AsyncStorage keys**: prefixar com `@appslug:` para evitar colisão entre apps no mesmo dispositivo de desenvolvimento
