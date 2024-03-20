/// <reference types= "cypress" />
import contrato from '../contratos/produtos.contrato'

describe('Teste de API em Produtos', () => {


    let token
    beforeEach(() => {
        cy.token('fulano@qa.com', 'teste').then(tkn => {
            token = tkn
        })
    });
  it('Deve validar contrato de produtos com sucesso', () => {
    cy.request( 'produtos').then(response => {
        return contrato.validateAsync(response.body)
    })
  });  
  
  it('Deve listar produtos com sucesso - GET', () => {
    cy.request({
      method: 'GET',
      url: 'produtos',
    }).should((response) =>{
      expect(response.status).to.equal(200)
      expect(response.body).to.have.property('produtos')
    })
  });

  it('Deve cadastrar produtos com sucesso - POST', () => {
    let produto = 'Produto EBAC '+ Math.floor(Math.random() * 10000000000)
    cy.CadastrarProduto(token, produto, 10, 'Cabo USB tipo C', 100)
    .should((response) =>{
        expect(response.status).to.equal(201)
        expect(response.body.message).equal('Cadastro realizado com sucesso')
    })
  });

  it('Deve validar mensagem de produto cadastrado anteriormente - POST', () => {
    cy.CadastrarProduto(token, 'Cabo USB 001', 10, 'Cabo USB tipo C', 100)
    .should((response) =>{
        expect(response.status).to.equal(400)
        expect(response.body.message).equal('Já existe produto com esse nome')
    })
  });

  it('Deve editar um produto com sucesso - PUT', () => {
    let produto = 'Produto EBAC editado'+ Math.floor(Math.random() * 10000000000)
    cy.CadastrarProduto(token, produto, 10, 'Produto EBAC Editado', 100)
        .then(response => {
            let id = response.body._id
            cy.request({
                method: 'PUT',
                url: `produtos/${id}`,
                headers: {
                  Authorization: token
                }, 
                body: {
                        "nome": produto,
                        "preco": 500,
                        "descricao": "Produto editado",
                        "quantidade": 100
                }     
            }).should( response => {
                expect(response.body.message).to.equal('Registro alterado com sucesso')
            })
        })
    
  });

  it('Deve deletar um produto com sucesso - DELETE', () => {
    cy.CadastrarProduto(token, 'Produto EBAC a ser deletado', 100, 'Delete', 50)
        .then( response => {
            let id = response.body._id
            cy.request({
                method: 'DELETE',
                url: `produtos/${id}`,
                headers: {
                  Authorization: token
                }     
            }).should( response => {
                expect(response.body.message).to.equal('Registro excluído com sucesso')
            })
        })
    
  });

});