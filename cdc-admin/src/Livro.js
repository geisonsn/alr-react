import React from 'react';
import InputCustomizado from './componentes/InputCustomizado';

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

export default class LivroBox extends React.Component {
    render() {
        return (
            <div>
                <div className="header">
                    <h1>Cadastro de livros</h1>
                </div>
                <div className="content" id="content">
                    <Formulario />
                </div>
            </div>
        );
    }
}