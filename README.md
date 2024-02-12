# Authify

### Descrição:
Authify é um sistema de autenticação e autorização seguro e escalável, projetado para aplicativos Web modernos. Utilizando JSON Web Tokens (JWT), o Authify oferece uma solução robusta para gerenciar a autenticação de usuários, a autorização de acesso e a proteção de rotas sensíveis.

#### Principais Recursos:
- Autenticação de usuário com credenciais (e-mail/senha).
- Geração e validação de tokens JWT.
- Rotas protegidas que exigem autenticação.
- Autorização flexível com suporte para diferentes níveis de permissões.
- Renovação automática de tokens expirados.
- Revogação de tokens em caso de comprometimento da conta do usuário.
- Auditoria de acesso para monitoramento e rastreamento.

Authify foi desenvolvido com foco na segurança, desempenho e escalabilidade, garantindo uma experiência confiável tanto para os desenvolvedores quanto para os usuários finais. Simplifique a implementação de autenticação em seus projetos com Authify.

Você pode acessar a documentação do projeto neste link: https://documenter.getpostman.com/view/21449018/2sA2r3b6av

## Requisitos Funcionais:

- [X] **Autenticação de Usuário:**
   - Permitir que os usuários se autentiquem utilizando credenciais (por exemplo, e-mail e senha).

- [X] **Geração de Token JWT:**
   - Após a autenticação bem-sucedida, gerar um token JWT válido.

- [X] **Validação de Token JWT:**
   - Verificar a validade e a integridade do token JWT enviado pelo cliente.

- [X] **Rotas Protegidas:**
   - Criar rotas que exigem autenticação para acesso.

## Requisitos Não Funcionais:

- [X] **Segurança:**
   - Implementar boas práticas de segurança para proteger a autenticação e os tokens JWT.
   - Utilizar HTTPS para comunicação segura entre cliente e servidor.

- [X] **Escalabilidade:**
   - Projetar o sistema de autenticação de forma que seja escalável para lidar com um grande número de usuários.

- [X] **Desempenho:**
   - Manter baixa latência durante o processo de autenticação e autorização.

- [X] **Manutenibilidade:**
   - Escrever código limpo e modular para facilitar a manutenção e futuras atualizações.

- [X] **Documentação:**
   - Documentar detalhadamente o processo de autenticação, autorização e utilização das rotas protegidas.

## Regras de Negócios:

- [X] **Validação de Credenciais:**
   - Verificar se as credenciais fornecidas pelo usuário são válidas durante o processo de autenticação.

- [X] **Expiração do Token:**
   - Definir um tempo de expiração para os tokens JWT para garantir a segurança.
   - Reautenticar o usuário quando o token expirar.

- [X] **Auditoria de Acesso:**
   - Registrar eventos de autenticação e autorização para fins de auditoria e rastreamento.

Esta lista aborda os requisitos funcionais, não funcionais e as regras de negócios necessárias para desenvolver um sistema de autenticação robusto e seguro utilizando JSON Web Tokens (JWT) em um projeto Back-End.