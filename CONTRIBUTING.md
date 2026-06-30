# Contribuindo — Converte Já

## Fluxo de branches

- `main` — código estável, sempre pronto para gerar build de release (EAS Build).
- `develop` — branch de integração do dia a dia. Todo trabalho novo nasce aqui.
- `feature/<nome-curto>` — uma branch por funcionalidade, criada a partir de `develop`.
  - Exemplo: `feature/tela-historico`, `feature/admob-banner`.

Fluxo: `feature/*` → PR para `develop` → quando `develop` estiver estável, PR de `develop` para `main`.

## Padrão de commits (Conventional Commits)

Formato: `tipo(escopo opcional): descrição curta no imperativo`

| Tipo | Quando usar |
|---|---|
| `feat` | nova funcionalidade |
| `fix` | correção de bug |
| `refactor` | mudança de código sem alterar comportamento |
| `style` | formatação, espaços, sem mudança de lógica |
| `docs` | documentação (README, comentários, Obsidian) |
| `test` | testes automatizados |
| `chore` | manutenção, dependências, configuração |
| `ci` | mudanças em workflows de CI/CD |

Exemplos:
```
feat(conversor): adicionar categoria de pressão
fix(home): corrigir ícone cortado no card de temperatura
chore(deps): atualizar expo para SDK 54
docs(roadmap): registrar decisão sobre EAS Build
```

## Antes de abrir PR

- Rodar `npx tsc --noEmit` para garantir que não há erros de tipo.
- Testar a mudança no emulador (`npm run android`) ou Expo Go.
