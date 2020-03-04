class Area {
    constructor(tela, tamanhoLinhas = 10, tamanhoColunas = 10) {
        this.map = [];
        this.tamanhoLinhas = tamanhoLinhas;
        this.tamanhoColunas = tamanhoColunas;
        this.ctx = tela.getContext('2d');

        for (let linha = 0; linha < this.tamanhoLinhas; linha++) {
            let tempLinha = [];
            for (let coluna = 0; coluna < this.tamanhoColunas; coluna++) {
                let celula = new Celula(linha, coluna);
                tempLinha.push(celula);
            }
            this.map.push(tempLinha);
        }
    }


    evoluir() {
        this.ctx.fillStyle = "rgb(255,255,255)";
        this.ctx.fillRect (0, 0, this.tamanhoColunas * 10, this.tamanhoLinhas * 10);
        
        for (let linha = 0; linha < this.tamanhoLinhas; linha++) {
            for (let coluna = 0; coluna < this.tamanhoColunas; coluna++) {
                let celula = this.buscarCelula(linha, coluna);
                if (celula) {
                    this.destino(celula);
                    this.ctx.fillStyle = celula.viva ? "rgb(200,0,0)" :  "rgb(255, 255 ,255)";
                    this.ctx.fillRect (celula.coluna * 10, celula.linha * 10, 10, 10);
                }                       
            }
        }

        return this;
    }

    destino(celula) {
        let vizinhos = this.contarVizinhos(celula);
    
        if (vizinhos.vivos == 8) {
            celula.reviver();
        }
        
        if (celula.viva) {
            if (vizinhos.vivos < vizinhos.mortos) {
                celula.reviver();
                let tmpVizinhos = this.buscarVizinhos(celula);

                tmpVizinhos.forEach((vizinho) => {
                    vizinho.reviver();
                });
            } else {
                if (celula.reviveu > parseInt(Math.random() * 100)) {
                    celula.matar();
                }
            }
        }

        // if (!celula.viva && vizinhos.mortos == 8) {
        //     let vizinhos = this.buscarVizinhos(celula);
        //     vizinhos.forEach(celula => {
        //         celula.reviver();
        //     });
        //     celula.reviver();
        //     return;
        // }
        
        // if (celula.viva && (vizinhos.vivos < 2 || vizinhos.vivos > 6)) {
        //     celula.matar();
        // } else if (!celula.viva && vizinhos.vivos < 3) {
        //     celula.reviver();
        // }
    }

    buscarCelula(linha, coluna) {
        return this.map[linha] ? (this.map[linha][coluna] ? this.map[linha][coluna] : null) : null;
    }

    contarVizinhos(celula) {
        let mortos = 0;
        let vivos = 0;
        let posVizinho, vizinho = null;

        let direcoes = ['norte', 'sul', 'leste', 'oeste', 'noroeste', 'nordeste', 'sudoeste', 'sudeste'];

        for (let index = 0; index < direcoes.length; index++) {
            posVizinho = celula.proximo(direcoes[index], 2);
            vizinho = this.buscarCelula(posVizinho.linha, posVizinho.coluna);

            if (vizinho) {
                vivos += vizinho.viva ? 1 : 0;
                mortos += vizinho.viva ? 0 : 1;
            };
        }

        return {
            'vivos': vivos,
            'mortos': mortos
        };
    }

    buscarVizinhos(celula) {
        let mortos = 0;
        let vivos = 0;
        let posVizinho, vizinho = null;
        let vizinhos = [];

        let direcoes = ['norte', 'sul', 'leste', 'oeste', 'noroeste', 'nordeste', 'sudoeste', 'sudeste'];

        for (let index = 0; index < direcoes.length; index++) {
            posVizinho = celula.proximo(direcoes[index]);
            vizinho = this.buscarCelula(posVizinho.linha, posVizinho.coluna);
            if (vizinho) {
                vizinhos.push(vizinho);
            };
        }

        return vizinhos;
    }
}

class Celula {

    reviveu = 0;
    morreu = 0;

    constructor(linha, coluna) {
        this.linha = linha;
        this.coluna = coluna;

        // Toda célula tem 50% de chance de nascer com vida
        this.viva = (parseInt(Math.random() * 10) > 5);
    }

    proximo(direcao, distancia = 1) {
        switch (direcao) {
            case 'norte':
                return {
                    'linha': this.linha - distancia, 'coluna': this.coluna,
                }
            case 'sul':
                return {
                    'linha': this.linha + distancia, 'coluna': this.coluna,
                }
            case 'leste':
                return {
                    'linha': this.linha, 'coluna': this.coluna - distancia,
                }
            case 'oeste':
                return {
                    'linha': this.linha, 'coluna': this.coluna + distancia,
                }
            case 'noroeste':
                return {
                    'linha': this.linha - distancia, 'coluna': this.coluna - distancia,
                }
            case 'nordeste':
                return {
                    'linha': this.linha - distancia, 'coluna': this.coluna + distancia,
                }
            case 'sudoeste':
                return {
                    'linha': this.linha + distancia, 'coluna': this.coluna - distancia,
                }
            case 'sudeste':
                return {
                    'linha': this.linha + distancia, 'coluna': this.coluna + distancia,
                }
        }
    }

    matar() {
        this.morreu++;
        this.viva = false;
    }

    reviver() {
        this.reviveu++;
        this.viva = true;
    }
}