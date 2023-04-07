# LabEddit-back 
O projeto de rede social da Labenu

# Projeto - Labeddit - Full Stack
#

O **Labeddit** é uma rede social com o objetivo de promover a conexão e interação entre pessoas. Quem se cadastrar no aplicativo poderá criar e curtir e comentar publicações.


##

**API para aplicação de gestão de projetos.**

*Aplicação banck-end de servidor express com banco de dados SQL SQlite 3.*

#

## Stack utilizada: Front-end: 
* NodeJS 

* Typescript

* Express

* SQL e SQLite

* Knex

* POO

* Arquitetura em camadas

* Geração de UUID

* Geração de hashes 

* Autenticação e autorização

* Roteamento

* Postman

#


# Requisitos:
<table>

  <tr>
    <th>Endpoints</th> 
    <td></td>
    <th>Autenticação e Autorização</th>
     <td></td>
    <th>Código</th>   
    </tr>
  <tr>
    <td> signup </td>
     <td></td>
    <td> identificação UUID</td>
     <td></td>
    <td>POO</td>
     <td></td>
  </tr>
  <tr>
    <td> login</td>
     <td></td>
    <td> senhas hasheadas com Bcrypt </td>
     <td></td>
    <td>Arquitetura em camadas</td>
     <td></td>
  </tr>
  <tr>
    <td> get posts</td>
     <td></td>
    <td> tokens JWT </td>
     <td></td>
    <td>Roteadores no Express</td>     
      <td></td>
  </tr>  

  <tr>
    <td>  create post</td>
    <td></td>  
  </tr>
  <tr>
    <td>  edit post</td>
    <td></td>  
  </tr>
  <tr>
    <td>   delete post</td>
    <td></td>
    </tr>
  <tr>
    <td>Like / dislike post
</td>
    <td></td>
  </tr>
  <tr>
    <td>Comments
</td>
    <td></td>
  </tr>
</table>


#
#
## Exemplos de requisição

* Signup
Endpoint público utilizado para cadastro. Devolve um token jwt.
* Login
Endpoint público utilizado para login. Devolve um token jwt.
* Get posts
Endpoint protegido, requer um token jwt para acessá-lo.
* Create post
Endpoint protegido, requer um token jwt para acessá-lo.
* Edit post
Endpoint protegido, requer um token jwt para acessá-lo.
Só quem criou o post pode editá-lo e somente o conteúdo pode ser editado.
* Delete post
Endpoint protegido, requer um token jwt para acessá-lo.
Só quem criou o post pode deletá-lo. Admins podem deletar o post de qualquer pessoa.
* Like or Dislike post (mesmo endpoint faz as duas coisas)
Endpoint protegido, requer um token jwt para acessá-lo.
Quem criou o post não pode dar like ou dislike no mesmo.
Caso dê um like em um post que já tenha dado like, o like é desfeito.
Caso dê um dislike em um post que já tenha dado dislike, o dislike é desfeito.
Caso dê um like em um post que tenha dado dislike, o like sobrescreve o dislike.
Caso dê um dislike em um post que tenha dado like, o dislike sobrescreve o like.

* Para entender a tabela likes_dislikes
no SQLite, lógicas booleanas devem ser controladas via 0 e 1 (INTEGER) quando like valer 1 na tabela é porque a pessoa deu like no post 
na requisição like é true
quando like valor 0 na tabela é porque a pessoa deu dislike no post 
na requisição like é false
caso não exista um registro na tabela de relação, é porque a pessoa não deu like nem dislike 
caso dê like em um post que já tenha dado like, o like é removido (deleta o item da tabela)
caso dê dislike em um post que já tenha dado dislike, o dislike é removido (deleta o item da tabela)

#

## Execute a aplicação

rodar o script de dev (npm run dev) ou rodar ou buildar o (npm run start).

 Servidor rodando na porta  3003. 
#

## 🔗 Links

[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/marcelo-bigaram/)


