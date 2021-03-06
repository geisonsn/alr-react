import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from './componentes/InputCustomizado';
import BotaoSubmitCustomizado from './componentes/BotaoSubmitCustomizado';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros';

class FormularioAutor extends Component {

    constructor() {
        super();
        this.state = {
          nome: '',
          email: '', 
          senha: ''
        };
        this.enviaForm = this.enviaForm.bind(this);        
    }

    enviaForm(event) {
        event.preventDefault();
        $.ajax({
          url: 'http://localhost:8080/api/autores',
          contentType: 'application/json',
          dataType: 'json',
          type: 'post',
          data: JSON.stringify({nome: this.state.nome, email: this.state.email, senha: this.state.senha}),
          success: function(response) {
                PubSub.publish('atualiza-lista-autores', response);
                this.setState({nome: '', email: '', senha: ''});
          }.bind(this),
          error: function(response) {
                new TratadorErros().publicaErros(response.responseJSON);
          },
          beforeSend: () => {
              PubSub.publish('limpa-erros', {});
          }
        });
    }
    salvaAlteracao(nomeInput, event) {
        let campo = [];
        campo[nomeInput] = event.target.value;
        this.setState(campo);
    }

    render() {
        return (
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">

                  <InputCustomizado 
                      type="text"
                      id="nome"
                      name="nome" 
                      label="Nome"
                      value={this.state.nome} 
                      onChange={this.salvaAlteracao.bind(this, 'nome')}
                  />

                  <InputCustomizado 
                      type="email"
                      id="email"
                      name="email" 
                      label="Email"
                      value={this.state.email} 
                      onChange={this.salvaAlteracao.bind(this, 'email')}
                  />

                  <InputCustomizado 
                      type="password"
                      id="senha"
                      name="senha" 
                      label="Senha"
                      value={this.state.senha} 
                      onChange={this.salvaAlteracao.bind(this, 'senha')}
                  />

                  <BotaoSubmitCustomizado label="Gravar"/>
                </form>             

            </div> 
        );
    }
}

class TabelaAutores extends Component {
    
    render() {
        return (
            <div>            
                <table className="pure-table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.props.lista.map(autor => {
                        return (
                          <tr key={autor.id}>
                            <td>{autor.nome}</td>
                            <td>{autor.email}</td>
                          </tr>
                        );
                      })
                    }
                  </tbody>
                </table> 
            </div>
        );
    }
}

export default class AutorBox extends Component {
    constructor() {
        super();
        this.state = {lista: []};
    }
    componentDidMount() {
        $.ajax({
            url: 'http://localhost:8080/api/autores',
            dataType: 'json',
            success: function(response) {
                this.setState({lista:response});
            }.bind(this)
        });

        PubSub.subscribe('atualiza-lista-autores', function(topico, novaLista) {
            this.setState({lista: novaLista});
        }.bind(this));
    }    
    render() {
        return (
            <div>
                <div className="header">
                    <h1>Cadastro de autores</h1>
                </div>
                <div className="content" id="content">
                    <FormularioAutor/>
                    <TabelaAutores lista={this.state.lista}/>
                </div>
            </div>
        );
    }
}