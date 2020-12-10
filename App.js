'strict';

/**
    Programa:   Jogo da Velha
    Autor:      Fábio Moura de Oliveira
    Descrição:  Este programa foi criada com base no programa criado pelo professor
                Bonieky Lacerda do curso React Native do Zero ao Profissional.
                No programa original, do curso, o usuário do jogo marca as células
                do jogo da velha e é alternado entre a vez do circulo e do x.
                Ou seja, no programa, o professor demonstrou como criar o jogo da velha,
                entretanto, o jogador joga contra si próprio, ou seja, o jogador
                joga o 'x' e depois o 'o'.
                Aqui, eu fiz uma adaptação pra que o jogador jogue contra o computador.
                No caso do computador, ele utilizará o círculo 'o'.
**/

import React, { Component } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableHighlight, 
  Button 
} from 'react-native';
import { X } from './src/x';
import { O } from './src/o';

export default class JogoDaVelha extends Component {

    constructor(props) {
        super(props);
        this.state = {
            empate: 'nao',
            ganhador: '',
            tabuleiro_bloqueado: 'nao',
            vez: 'x',
            tabuleiro: [
                ['', '', ''],
                ['', '', ''],
                ['', '', ''],
            ]
        };

    }

    clicou_na_celula(indice_celula) {

        let linha_clicada = Math.trunc(indice_celula / 3);
        let coluna_clicada = indice_celula % 3;


        let celula_atual = this.state.tabuleiro[linha_clicada][coluna_clicada];

        if (celula_atual === '' && this.state.tabuleiro_bloqueado === 'nao') {
            this.state.tabuleiro[linha_clicada][coluna_clicada] = this.state.vez;

            this.state.ganhador = '';
            this.state.empate = '';

            this.verificar_marcacoes('x');

            if (this.state.ganhador === 'x' || this.state.empate === 'sim') {
                this.state.tabuleiro_bloqueado = 'sim';
                this.setState(this.state);
                return;
            }

            this.verificar_marcacoes('o');

            if (this.state.ganhador === 'o' || this.state.empate === 'sim') {
                this.state.tabuleiro_bloqueado = 'sim';
                this.setState(this.state);
                return;
            }

            this.setState(this.state);

            this.vez_do_computador_2();

            this.verificar_marcacoes('x');

            if (this.state.ganhador === 'x' || this.state.empate === 'sim') {
                this.state.tabuleiro_bloqueado = 'sim';
                this.setState(this.state);
                return;
            }

            this.verificar_marcacoes('o');

            if (this.state.ganhador === 'o' || this.state.empate === 'sim') {
                this.state.tabuleiro_bloqueado = 'sim';
                this.setState(this.state);
                return;
            }

            this.setState(this.state);

        }
    }

    verificar_marcacoes(vez_de) {

        // Contabiliza a quantidade de células não-vazias.
        let qt_celulas_nao_vazias = 0;

        // Verificar linhas.
        for (let linha = 0; linha < 3; linha++) {
            // No loop abaixo, percorre todas as colunas da linha atual.
            let qt_marcacoes = 0;
            for (let coluna = 0; coluna < 3; coluna++) {
                let celula_atual = this.state.tabuleiro[linha][coluna];

                if (celula_atual === vez_de) {
                    qt_marcacoes++;
                }

                if (celula_atual !== '') {
                    qt_celulas_nao_vazias++;
                }

            }

            // Se há três células marcadas do mesmo jogador, então, define-o
            // vencedor.
            if (qt_marcacoes === 3) {
                this.state.ganhador = vez_de;

                return;
            }
        }

        // Verificar as colunas.
        //qt_celulas_nao_vazias = 0;
        for (let coluna = 0; coluna < 3; coluna++) {
            // No loop abaixo, percorre todas as colunas da linha atual.
            let qt_marcacoes = 0;
            for (let linha = 0; linha < 3; linha++) {
                let celula_atual = this.state.tabuleiro[linha][coluna];

                if (celula_atual === vez_de) {
                    qt_marcacoes++;
                }

            }

            // Se há três células marcadas do mesmo jogador, então, define-o
            // vencedor.
            if (qt_marcacoes === 3) {
                this.state.ganhador = vez_de;

                return;
            }
        }

        // Verificar Diagonal Superior Esquerda a Diagonal Inferior Direita.
        let qt_marcacoes = 0;
        for (let linha_coluna = 0; linha_coluna < 3; linha_coluna++) {
            let celula_atual = this.state.tabuleiro[linha_coluna][linha_coluna];
            if (celula_atual === vez_de) {
                qt_marcacoes++;
            }
        }

        // Se há três células marcadas do mesmo jogador, então, define-o
        // vencedor.
        if (qt_marcacoes === 3) {
            this.state.ganhador = vez_de;
            return;
        }

        // Verificar Diagonal superior direita até diagonal inferior esquerda.
        qt_marcacoes = 0;
        coluna = 2;
        for (let linha = 0; linha < 3; linha++) {
            let celula_atual = this.state.tabuleiro[linha][coluna];

            if (celula_atual === vez_de) {
                qt_marcacoes++;
            }

            coluna--;
        }

        // Se há três células marcadas do mesmo jogador, então, define-o
        // vencedor.
        if (qt_marcacoes === 3) {
            this.state.ganhador = vez_de;
            return;
        }

        // Se chegarmos aqui, iremos verificar se todas as células foram preenchidas.
        if (qt_celulas_nao_vazias === 9) {
            this.state.ganhador = '';
            this.state.empate = 'sim';
        }
    }

    resetar_tabuleiro() {
        this.state.ganhador = '';
        this.state.empate = 'nao';
        this.state.vez = 'x';
        this.state.tabuleiro_bloqueado = 'nao';

        for (let linha = 0; linha < 3; linha++) {
            for (let coluna = 0; coluna < 3; coluna++) {
                this.state.tabuleiro[linha][coluna] = '';
            }
        }

        this.setState(this.state);
    }

    vez_do_computador_2() {

        let marcacoes_do_jogador = new Array(8);
        let marcacoes_do_computador = new Array(8);

        // Cada célula terá um índice, então, podemos sortear uma célula vazia
        let marcacoes_vazias = [];

        // Da esquerda pra direita e de cima pra baixo, haverá um identificador
        // único e exclusivo pra cada célula do tabuleiro.
        let id_celula = -1;

        let indice_marcacoes = 0;
        for (let linha = 0; linha < 3; linha++) {
            let qt_marcacoes_do_jogador = 0;
            let qt_marcacoes_do_computador = 0;

            for (let coluna = 0; coluna < 3; coluna++) {
                // Podemos obter o identificador de qualquer célula através da fórmula abaixo.
                id_celula = 3 * linha + coluna;

                if (this.state.tabuleiro[linha][coluna] === 'x') {
                    qt_marcacoes_do_jogador++;
                }
                else if (this.state.tabuleiro[linha][coluna] === 'o') {
                    qt_marcacoes_do_computador++;
                }
                else if (this.state.tabuleiro[linha][coluna] === '') {
                    marcacoes_vazias.push(id_celula);
                }
            }

            // Armazena as marcações da linha atual.
            marcacoes_do_computador[indice_marcacoes] = qt_marcacoes_do_computador;
            marcacoes_do_jogador[indice_marcacoes] = qt_marcacoes_do_jogador;
            indice_marcacoes++;
        }
        for (let coluna = 0; coluna < 3; coluna++) {
            let qt_marcacoes_do_jogador = 0;
            let qt_marcacoes_do_computador = 0;

            for (let linha = 0; linha < 3; linha++) {

                if (this.state.tabuleiro[linha][coluna] === 'x') {
                    qt_marcacoes_do_jogador++;
                } else if (this.state.tabuleiro[linha][coluna] === 'o') {
                    qt_marcacoes_do_computador++;
                } else if (this.state.tabuleiro[linha][coluna] === '') {
                    id_celula = 3 * linha + coluna;
                    if (marcacoes_vazias.includes(id_celula) === false) {
                        marcacoes_vazias.push(id_celula);
                    }
                }
            }

            marcacoes_do_computador[indice_marcacoes] = qt_marcacoes_do_computador;
            marcacoes_do_jogador[indice_marcacoes] = qt_marcacoes_do_jogador;
            indice_marcacoes++;
        }

        // Verifica a diagonal superior esquerda a direita inferior direita.
        let qt_marcacoes_do_jogador = 0;
        let qt_marcacoes_do_computador = 0;
        marcacoes_do_computador[indice_marcacoes] = 0;
        marcacoes_do_jogador[indice_marcacoes] = 0;

        id_celula = 0;
        for (let linha_coluna = 0; linha_coluna < 3; linha_coluna++) {

            if (this.state.tabuleiro[linha_coluna][linha_coluna] === 'x') {
                qt_marcacoes_do_jogador++;
            } else if (this.state.tabuleiro[linha_coluna][linha_coluna] === 'o') {
                qt_marcacoes_do_computador++;
            } else if (this.state.tabuleiro[linha_coluna][linha_coluna] === '') {
                id_celula = 3 * linha_coluna + linha_coluna;
                if (marcacoes_vazias.includes(id_celula) === false) {
                    marcacoes_vazias.push(id_celula);
                }
            }
        }

        marcacoes_do_computador[indice_marcacoes] = qt_marcacoes_do_computador;
        marcacoes_do_jogador[indice_marcacoes] = qt_marcacoes_do_jogador;

        indice_marcacoes++;
        marcacoes_do_computador[indice_marcacoes] = 0;
        marcacoes_do_jogador[indice_marcacoes] = 0;

        qt_marcacoes_do_computador = 0;
        qt_marcacoes_do_jogador = 0;

        coluna = 2;
        for (let linha = 0; linha < 3; linha++) {
            if (this.state.tabuleiro[linha][coluna] === 'x') {
                qt_marcacoes_do_jogador++;
            } else if (this.state.tabuleiro[linha][coluna] === 'o') {
                qt_marcacoes_do_computador++;
            } else if (this.state.tabuleiro[linha][coluna] === '') {
                id_celula = 3 * linha + coluna;
                if (marcacoes_vazias.includes(id_celula) === false) {
                    marcacoes_vazias.push(id_celula);
                }
            }
            coluna--;
        }

        marcacoes_do_computador[indice_marcacoes] = qt_marcacoes_do_computador;
        marcacoes_do_jogador[indice_marcacoes] = qt_marcacoes_do_jogador;
        let indice_a_ser_marcado = -1;
        for (let indice_vetor = 0; indice_vetor < 8; indice_vetor++) {
            if (marcacoes_do_computador[indice_vetor] === 2 && marcacoes_do_jogador[indice_vetor] === 0) {
                indice_a_ser_marcado = indice_vetor;
                break;
            }

        }

        // Só iremos analisar as jogadas do jogador, se o computador não pode
        // ganhar na vez dele, então, tentar impedir a vitória do jogador humano.
        if (indice_a_ser_marcado === -1) {
            for (let indice_vetor = 0; indice_vetor < 8; indice_vetor++) {
                if (marcacoes_do_jogador[indice_vetor] === 2 && marcacoes_do_computador[indice_vetor] === 0) {
                    indice_a_ser_marcado = indice_vetor;
                    break;
                }
            }
        }

        // indice_a_ser_marcado corresponde a posição dentro do vetor, precisamos
        // identificar a qual linha, coluna ou diagonal, o índice corresponde,
        // então, no switch abaixo, é feita esta conversão.
        if (indice_a_ser_marcado !== -1) {
            switch (indice_a_ser_marcado) {
                // Linha.
                case 0: case 1: case 2: {
                    let linha = indice_a_ser_marcado;
                    for (let coluna = 0; coluna < 3; coluna++) {
                        if (this.state.tabuleiro[linha][coluna] === '') {
                            this.state.tabuleiro[linha][coluna] = 'o';
                            break;
                        }
                    }
                }
                    break;
                // Coluna:
                case 3: case 4: case 5: {
                    coluna = indice_a_ser_marcado % 3;
                    for (let linha = 0; linha < 3; linha++) {
                        if (this.state.tabuleiro[linha][coluna] === '') {
                            this.state.tabuleiro[linha][coluna] = 'o';
                            break;
                        }
                    }
                }
                    break;
                // Diagonal superior esquerda a diagonal inferior direita.
                case 6: {
                    for (let linha_coluna = 0; linha_coluna < 3; linha_coluna++) {
                        if (this.state.tabuleiro[linha_coluna][linha_coluna] === '') {
                            this.state.tabuleiro[linha_coluna][linha_coluna] = 'o';
                            break;
                        }
                    }
                }
                    break;
                // Diagonal superior direita a diagonal inferior esquerda.
                case 7: {
                    let coluna = 2;
                    for (let linha = 0; linha < 3; linha++) {
                        if (this.state.tabuleiro[linha][coluna] === '') {
                            this.state.tabuleiro[linha][coluna] = 'o';
                            break;
                        }
                        coluna--;
                    }
                }
                    break;
            }
        }
        else {
            // Só iremos atribuir a tabuleiro se houver marcacoes_vazias.
            if (marcacoes_vazias.length > 0) {
                // Então, devemos escolher uma célula vazia aleatoriamente.
                indice_aleatorio = Math.random() * marcacoes_vazias.length;
                indice_aleatorio = Math.trunc(indice_aleatorio);

                id_celula = marcacoes_vazias[indice_aleatorio];
                marcacoes_vazias = marcacoes_vazias.splice(id_celula, 1);

                // Obter linha e coluna.
                let indice_linha = Math.trunc(id_celula / 3);
                let indice_coluna = id_celula % 3;

                this.state.tabuleiro[indice_linha][indice_coluna] = 'o';
            }
        }

        // Atualiza pra aparecer na tela.
        this.setState(this.state);
    }


    render() {
        return (
            <View style={styles.container}>
                <View style={styles.area}>
                    <View style={[styles.velhaVertical, { borderLeftWidth: 0 }]}>
                        <TouchableHighlight
                            underlayColor="#eeeeee"
                            onPress={() => {
                                //this.clicou('a1');
                                this.clicou_na_celula(0);

                            }} style={[styles.velhaHorizontal, { borderTopWidth: 0 }]}>
                            <View>
                                {this.state.tabuleiro[0][0] === 'x' && <X />}
                                {this.state.tabuleiro[0][0] === 'o' && <O />}
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight
                            underlayColor="#eeeeee"

                            onPress={() => {
                                this.clicou_na_celula(3);
                            }}
                            style={styles.velhaHorizontal}>
                            <View>
                                {this.state.tabuleiro[1][0] === 'x' && <X />}
                                {this.state.tabuleiro[1][0] === 'o' && <O />}
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight
                            underlayColor="#eeeeee"
                            onPress={() => {
                                this.clicou_na_celula(6);
                            }} style={styles.velhaHorizontal}>
                            <View>
                                {this.state.tabuleiro[2][0] === 'x' && <X />}
                                {this.state.tabuleiro[2][0] === 'o' && <O />}
                            </View>
                        </TouchableHighlight>
                    </View>
                    <View style={styles.velhaVertical}>
                        <TouchableHighlight
                            underlayColor="#eeeeee"
                            onPress={() => {
                                this.clicou_na_celula(1);
                            }} style={[styles.velhaHorizontal, { borderTopWidth: 0 }]}>
                            <View>
                                {this.state.tabuleiro[0][1] === 'x' && <X />}
                                {this.state.tabuleiro[0][1] === 'o' && <O />}
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight
                            underlayColor="#eeeeee"
                            onPress={() => {
                                this.clicou_na_celula(4);
                            }} style={styles.velhaHorizontal}>
                            <View>
                                {this.state.tabuleiro[1][1] === 'x' && <X />}
                                {this.state.tabuleiro[1][1] === 'o' && <O />}
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight
                            underlayColor="#eeeeee"
                            onPress={() => {
                                this.clicou_na_celula(7);
                            }} style={styles.velhaHorizontal}>
                            <View>
                                {this.state.tabuleiro[2][1] === 'x' && <X />}
                                {this.state.tabuleiro[2][1] === 'o' && <O />}
                            </View>
                        </TouchableHighlight>
                    </View>
                    <View style={styles.velhaVertical}>
                        <TouchableHighlight
                            underlayColor="#eeeeee"
                            onPress={() => {
                                this.clicou_na_celula(2);
                            }} style={[styles.velhaHorizontal, { borderTopWidth: 0 }]}>
                            <View>
                                {this.state.tabuleiro[0][2] === 'x' && <X />}
                                {this.state.tabuleiro[0][2] === 'o' && <O />}
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight
                            underlayColor="#eeeeee"
                            onPress={() => {
                                this.clicou_na_celula(5);
                            }} style={styles.velhaHorizontal}>
                            <View>
                                {this.state.tabuleiro[1][2] === 'x' && <X />}
                                {this.state.tabuleiro[1][2] === 'o' && <O />}
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight
                            underlayColor="#eeeeee"
                            onPress={() => {
                                this.clicou_na_celula(8);
                            }} style={styles.velhaHorizontal}>
                            <View>
                                {this.state.tabuleiro[2][2] === 'x' && <X />}
                                {this.state.tabuleiro[2][2] === 'o' && <O />}
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
                <View style={styles.infoArea}>
                    <View style={styles.infoVez}>
                        <Text>Vez de:</Text>
                        {this.state.vez === 'x' && <X />}
                        {this.state.vez === 'o' && <O />}
                    </View>
                    <View style={styles.infoAviso}>
                        {this.state.ganhador === 'x' && <X />}
                        {this.state.ganhador === 'o' && <O />}
                        {this.state.ganhador !== '' && <Text>GANHOU</Text>}
                        {this.state.empate === 'sim' && <Text>** EMPATE **</Text>}
                    </View>
                </View>

                <View style={styles.reset_button} >
                    <Button title="Começar de novo" onPress={() => {
                        //this.resetar();
                        this.resetar_tabuleiro();
                    }} />
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    area: {
        width: 300,
        height: 300,
        flexDirection: 'row',
    },
    velhaVertical: {
        flex: 1,
        borderLeftWidth: 5,
        borderLeftColor: '#000',
    },
    velhaHorizontal: {
        flex: 1,
        borderTopWidth: 5,
        borderTopColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoArea: {
        marginTop: 30,
        flexDirection: 'row',
    },
    infoVez: {
        width: 90,
        height: 90,
        backgroundColor:
            '#cccccc',
        justifyContent:
            'center',
        alignItems:
            'center',
    },
    infoAviso: {
        flex: 1,
        backgroundColor:
            '#eee',
        justifyContent:
            'center',
        alignItems:
            'center',
    },
    reset_button: {
        marginTop: 10,
    }

})
    ;