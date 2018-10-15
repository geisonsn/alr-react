import React from 'react';
import InputCustomizado from './componentes/InputCustomizado';
import BotaoSubmitCustomizado from './componentes/BotaoSubmitCustomizado'
import SelectCustomizado from './componentes/SelectCustomizado';
import $ from 'jquery';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros';

class Formulario extends React.Component {
    constructor() {
        super();
        this.state = {
            titulo: '',
            preco: '',
            autorId: '',
        }
        this.enviaForm = this.enviaForm.bind(this);
        this.setTitulo = this.setTitulo.bind(this);
        this.setPreco = this.setPreco.bind(this);
        this.setAutorId = this.setAutorId.bind(this);
    }
    setTitulo(event) {
        this.setState({ titulo: event.target.value });
    }
    setPreco(event) {
        this.setState({ preco: event.target.value });
    }
    setAutorId(event) {
        this.setState({ autorId: event.target.value});
    }
    enviaForm(event) {
        event.preventDefault();
        $.ajax({
            url: 'http://localhost:8080/api/livros',
            contentType: 'application/json',
            type: 'json',
            method: 'POST',
            data: JSON.stringify({ titulo: this.state.titulo, preco: this.state.preco, autorId: this.state.autorId }),
            success: response => {
                PubSub.publish('atualiza-lista-livros', response);
                this.setState({titulo: '', preco: '', autorId: ''});
            },
            error: response => {
                new TratadorErros().publicaErros(response.responseJSON);
            },
            beforeSend: () => {
                PubSub.publish('limpa-erros', {});
            }
        });
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

                    <SelectCustomizado
                        id="autorId"
                        name="autorId"
                        label="Autor"
                        options={this.props.autores}
                        onChange={this.setAutorId} 
                        value={this.state.autorId}/>

                    <BotaoSubmitCustomizado label="Gravar" />
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
        this.state = { livros: [], autores: [] };
    }
    componentDidMount() {
        $.ajax({
            url: 'http://localhost:8080/api/livros',
            dataType: 'json',
            success: (response) => {
                this.setState({ livros: response });
            }
        });
        $.ajax({
            url: 'http://localhost:8080/api/autores',
            dataType: 'json',
            success: (response) => {
                this.setState({ autores: response });
            }
        });
        PubSub.subscribe('atualiza-lista-livros', (topico, novaLista) => {
            this.setState({ livros: novaLista });
        });
    }
    render() {
        return (
            <div>
                <div className="header">
                    <h1>Cadastro de livros</h1>
                </div>
                <div className="content" id="content">
                    <Formulario autores={this.state.autores}/>
                    <TabelaLivros lista={this.state.livros} />
                </div>
            </div>
        );
    }
}