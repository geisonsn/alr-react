import PubSub from 'pubsub-js';

export default class TratadorErros {
    publicaErros(erros) {
        for (let erro of erros.errors) {
            PubSub.publish('erro-validacao', erro);
        }
    }
}