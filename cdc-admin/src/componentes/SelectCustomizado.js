import React from 'react';
import PubSub from 'pubsub-js';

export default class SelectCustomizado extends React.Component {
    constructor() {
        super();
        this.state = {msgErro: ''};
    }
    componentDidMount() {
        PubSub.subscribe('erro-validacao', (topico, erro) => {
            if (erro.field === this.props.id) {
                this.setState({msgErro: erro.defaultMessage});
            }
        });
        PubSub.subscribe('limpa-erros', topico => {
            this.setState({msgErro: ''});
        });
    }
    render() {
        return (
            <div className="pure-control-group">
                <label htmlFor={this.props.id}>{this.props.label}</label>
                <select 
                    id={this.props.id} 
                    name={this.props.name}
                    value={this.props.value}
                    onChange={this.props.onChange} >
                    <option value="null">Selecione</option>                        
                    {
                        this.props.options.map(autor => {
                            return (
                                <option key={autor.id} value={autor.id}>{autor.nome}</option>
                            )
                        })
                    }
                </select>
                <span className="erro">{this.state.msgErro}</span>
            </div>
        );
    }
}