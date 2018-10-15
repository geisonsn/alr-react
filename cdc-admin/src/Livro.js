import React from 'react';
import InputCustomizado from './componentes/InputCustomizado';
import $ from 'jquery';

class Formulario extends React.Component {
    constructor() {
        super();
        this.state = {
            titulo: '',
            preco: ''
        }
        this.setTitulo = this.setTitulo.bind(this);
        this.setPreco = this.setPreco.bind(this);
    }
    setTitulo(event) {
        this.setState({titulo: event.target.value});
    }
    setPreco(event) {
        this.setState({preco: event.target.value});
    }
    render() {
        return (
            <div className="pure-form pure-form-aligned">
                    <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">

                        <InputCustomizado 
                            type="text"
                            id="titulo"
                            name="titulo" 
                            label="Título"
                            value={this.state.titulo} 
                            onChange={this.setTitulo}
                        />

                        <InputCustomizado 
                            type="number"
                            id="preco"
                            name="preco" 
                            label="Preço"
                            value={this.state.preco} 
                            onChange={this.setPreco}
                        />

                        <div className="pure-control-group">
                            <label htmlFor="autor">Autor</label>
                            <select id="autor">
                                <option>Selecione</option>                        
                            </select>
                            <span className="erro">{this.state.msgErro}</span>
                        </div> 
                    </form>             

                </div>
        );
    }
}

function TabelaLivros(props) {
    return (
        <div>            
            <table className="pure-table">
                <thead>
                <tr>
                    <th>Título</th>
                    <th>Autor</th>
                    <th>Preço</th>
                </tr>
                </thead>
                <tbody>
                {
                    props.lista.map(livro => {
                        return (
                            <tr key={livro.id}>
                            <td>{livro.titulo}</td>
                            <td>{livro.autor.nome}</td>
                            <td>{livro.preco}</td>
                            </tr>
                        );
                    })
                }
                </tbody>
            </table> 
        </div>
    );
}

export default class LivroBox extends React.Component {
    constructor() {
        super();
        this.state = {lista: []};
    }
    componentDidMount() {
        $.ajax({
            url: 'http://localhost:8080/api/livros',
            dataType: 'json',
            success: (response) => {
                this.setState({lista: response});
            }
        });
    }
    render() {
        return (
            <div>
                <div className="header">
                    <h1>Cadastro de livros</h1>
                </div>
                <div className="content" id="content">
                    <Formulario />
                    <TabelaLivros lista={this.state.lista}/>
                </div>
            </div>
        );
    }
}