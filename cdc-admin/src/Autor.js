import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from './componentes/InputCustomizado';
import BotaoSubmitCustomizado from './componentes/BotaoSubmitCustomizado';

class FormularioAutor extends Component {

    constructor() {
        super();
        this.state = {
          lista: [],
          nome: '',
          email: '', 
          senha: ''
        };
        this.enviaForm = this.enviaForm.bind(this);
        this.setNome = this.setNome.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setSenha = this.setSenha.bind(this);
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
            this.props.callbackAtualizaListagem(response);
          }.bind(this),
          error: function(response) {
    
          }
        });
    }

    setNome(event) {
    this.setState({nome: event.target.value});
    }

    setEmail(event) {
    this.setState({email: event.target.value});
    }

    setSenha(event) {
    this.setState({senha: event.target.value});
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
                      onChange={this.setNome}
                  />

                  <InputCustomizado 
                      type="email"
                      id="email"
                      name="email" 
                      label="Email"
                      value={this.state.email} 
                      onChange={this.setEmail}
                  />

                  <InputCustomizado 
                      type="password"
                      id="senha"
                      name="senha" 
                      label="Senha"
                      value={this.state.senha} 
                      onChange={this.setSenha}
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
        this.atualizaListagem = this.atualizaListagem.bind(this);
    }
    componentDidMount() {
        $.ajax({
            url: 'http://localhost:8080/api/autores',
            dataType: 'json',
            success: function(response) {
            this.setState({lista:response});
            }.bind(this)
        });
    }
    atualizaListagem(novaLista) {
        this.setState({lista: novaLista});
    }
    render() {
        return (
            <div>
                <FormularioAutor callbackAtualizaListagem={this.atualizaListagem} />
                <TabelaAutores lista={this.state.lista} /> 
            </div>
        );
    }
}