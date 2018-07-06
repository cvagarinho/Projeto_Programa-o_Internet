"use strict";
/**
 * Função que será executada quando a página estiver toda carregada, criando a variável global "info" com um objeto Information
 * Aproveitamos ainda para solicitar ao servidor o carregamento de dados de forma assincrona(ajax)
 * @memberof window
 * @params {Event} event - objeto que representará o evento
 */

window.onload = function(event) {
    var info = new Information("divInformation");
    info.getPlayer();
    info.getCountry();
    window.info = info;
};

/** 
 * @class Guarda toda informação necessaria na execução do exercicio 
 * @constructs Information
 * @param {string} id - id do elemento HTML que contém a informação.
 * 
 * @property {string} id - id do elemento HTML que contém a informação.
 * @property {country[]} countries - Array de objetos do tipo Country, para guardar todos os countries do nosso sistema
 * @property {player[]} players - Array de objetos do tipo player, para guardar todas as pessoas do nosso sistema
 */
function Information(id) {
    this.id = id;
    this.players = [];
    this.countries = [];
};

/** 
 * @class Estrutura com capacidade de armazenar o estado de uma entidade pessoa 
 * @constructs Player
 * @param {int} id - id da pessoa
 * @param {int} name - nome da pessoa
 * @param {Date} birthDate - data de nascimento da pessoa
 * @param {int} idCountry - id do pais da pessoa
 */
function Player(id, name, birthDate, idCountry) {
    this.id = id;
    this.name = name;
    this.birthDate = birthDate;
    this.idCountry = idCountry;
};

/** 
 * @class Estrutura com capacidade de armazenar o estado de uma entidade país 
 * @constructs Country
 * @param {int} id - id do país
 * @param {int} name - nome do país
 * @param {int} shortName - abreviatura
 */
function Country(id, name, shortName) {
    this.id = id;
    this.name = name;
    this.shortName = shortName;
};

/**
 * coloca a palavra "home" no div titulo e limpa o div informação
 */
Information.prototype.showHome = function() {
    document.getElementById("headerTitle").textContent = "Home";
    replaceChilds(this.id, document.createElement("div"));
    document.getElementById("formPlayer").style.display = "none";
};

/**
 * coloca a palavra "Players" no div titulo, cria dinamicamente uma tabela com a informação das pessoas e respetivos botões de crud
 */
Information.prototype.showPlayers = function() {


    document.getElementById("headerTitle").textContent = "Players";
    document.getElementById("formPlayer").style.display = "none";
    var table = document.createElement("table");
    table.id = "tablePlayer";
    table.appendChild(tableHead(new Player(), true));
    for (var i = 0; i < this.players.length; i++) {
        table.appendChild(tableLine(this.players[i], false));
    }
    var divTable = document.createElement("divTable");
    divTable.setAttribute("id", "divTable");
    divTable.appendChild(table);

    function deletePlayerEventHandler() {
        var table = document.getElementById("tablePlayer");
        for (var i = 1, row; row = table.rows[i]; i++) {
            var checkBox = row.cells[0].firstChild;
            var idPlayer = row.cells[1].firstChild.nodeValue;
            if (checkBox.checked) {
                info.removePlayer(idPlayer);
            }
        }
    }

    function newPlayerEventHandler() {
        replaceChilds("divTable", document.createElement("div"));
        document.getElementById("formPlayer").action = "javascript: info.processingPlayer('create');";
        document.getElementById("formPlayer").style.display = "block";
        for (var i = 0; i < info.countries.length; i++)
            document.getElementById("countries").options[i] = new Option(info.countries[i].name, info.countries[i].id);
    }

    function updatePlayerEventHandler() {
        var idPlayer = 0;
        for (var i = 1; i < table.rows.length; i++) {
            var checkBox = table.rows[i].cells[0].firstChild;
            if (checkBox.checked)
                idPlayer = parseInt(table.rows[i].cells[1].firstChild.nodeValue);
        }
        replaceChilds("divTable", document.createElement("div"));
        document.getElementById("formPlayer").action = "javascript: info.processingPlayer('update');";
        document.getElementById("formPlayer").style.display = "block";
        document.getElementById("id").value = idPlayer;
        document.getElementById("name").value = info.players[info.players.findIndex(i => i.id === idPlayer)].name;
        document.getElementById("date").value = info.players[info.players.findIndex(i => i.id === idPlayer)].birthDate.toString().split('T')[0];
        var idCountry = info.players[info.players.findIndex(i => i.id === idPlayer)].idCountry;
        for (var i = 0; i < info.countries.length; i++) {
            document.getElementById("countries").options[i] = new Option(info.countries[i].name, info.countries[i].id);
            if (info.countries[i].id === idCountry)
                document.getElementById("countries").selectedIndex = i;
        }
    }
    createButton(divTable, newPlayerEventHandler, "New Player");
    createButton(divTable, deletePlayerEventHandler, "Delete Player");
    createButton(divTable, updatePlayerEventHandler, "Update Player");
    replaceChilds(this.id, divTable);


};

/**
 * Função genérica que cria um botão HTML, dá-lhe um evento e coloca-o na árvore de nós
 * @param {HTMLElement} fatherNode - nó pai do botão
 * @param {function} eventHandler - evento do botão.
 * @param {String} value - texto do botão.
 */
function createButton(fatherNode, eventHandler, value) {
    var button = document.createElement("input");
    button.type = "button";
    button.value = value;
    button.addEventListener("click", eventHandler);
    fatherNode.appendChild(button);
}

/**
 * Função que substitui todos os elementos filhos de um elemento HTML por um novo elemento HTML (facilitador de DOM)
 * @param {string} id - id do elemento HTML para o qual se pretende substituir os filhos.
 * @param {HTMLElement} newSon - elemento HTML que será o novo filho.
 */
function replaceChilds(id, newSon) {
    var no = document.getElementById(id);
    while (no.hasChildNodes()) {
        no.removeChild(no.lastChild);
    }
    no.appendChild(newSon);
};

/**
 * Função que recebe um qualquer objeto e retorna dinamicamente uma linha de tabela HTML com os supostos headers
 * @param {Object} object - objecto do qual vamos transformar os atributos e TH
 */
function tableHead(object) {
    var tr = document.createElement("tr");
    tr.appendChild(document.createElement("th"));
    for (var property in object) {
        if ((object[property] instanceof Function) === false) {
            var td = document.createElement("th");
            td.textContent = property[0].toUpperCase() + property.substr(1, property.length - 1);;
            tr.appendChild(td);
        }
    }
    return tr;
};

/**
 * Função que recebe um qualquer objeto e retorna dinamicamente uma linha de tabela HTML com informação relativa ao estado das suas propriedades
 * @param {Object} object - objecto do qual vamos transformar o conteudo dos seus atributos em TD
 */
function tableLine(object) {
    var tr = document.createElement("tr");
    tr.appendChild(createCellCheckbox());
    for (var property in object) {
        if ((object[property] instanceof Function) === false) {
            var td = document.createElement("td");
            td.textContent = object[property];
            tr.appendChild(td);
        }
    }
    return tr;
};
/**
 * Função genérica que tem como objetivo a criação de uma coluna com checkbox
 */
function createCellCheckbox() {
    var td = document.createElement("td");
    var check = document.createElement("input");
    check.type = "checkbox";
    td.appendChild(check);
    return td;
}

/**
 * Função que que tem como principal objetivo solicitar ao servidor NODE.JS o recurso player através do verbo GET, usando pedidos assincronos e JSON
 */
Information.prototype.getPlayer = function() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:8081/player", true);
    xhr.onreadystatechange = function() {
        if ((this.readyState === 4) && (this.status === 200)) {
            var response = JSON.parse(xhr.responseText);
            info.players = [];
            response.player.forEach(function(current) {
                info.players.push(new Player(current.id, current.name, current.birthDate.split("T")[0], current.idCountry));
            });
        }
    };
    xhr.send();
};
/**
 * Função que que tem como principal objetivo solicitar ao servidor NODE.JS o recurso país através do verbo GET, usando pedidos assincronos e JSON
 */
Information.prototype.getCountry = function() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:8081/country", true);
    xhr.onreadystatechange = function() {
        if ((this.readyState === 4) && (this.status === 200)) {
            var response = JSON.parse(xhr.responseText);
            info.countries = [];
            response.country.forEach(function(current) {
                info.countries.push(new Country(current.id, current.name, current.shortName));
            });
        }
    };
    xhr.send();
};
/**
 * Função que apaga o recurso jogador com um pedido ao NODE.JS através do verbo DELETE, usando pedidos assincronos e JSON
 */
Information.prototype.removePlayer = function(id) {
        var xhr = new XMLHttpRequest();
        xhr.open("DELETE", "http://localhost:8081/player/" + id, true);
        xhr.onreadystatechange = function() {
            if ((this.readyState === 4) && (this.status === 200)) {
                info.players.splice(info.players.findIndex(i => i.id === id), 1);
                info.showPlayers();
            }
        };
        xhr.send();
    }
    /**
     * Função que insere ou atualiza o recurso pessoa com um pedido ao servidor NODE.JS através do verbo POST ou PUT, usando pedidos assincronos e JSON
     *  * @param {String} acao - controla qual a operação do CRUD queremos fazer
     */
Information.prototype.processingPlayer = function(acao) {
    var id = document.getElementById("id").value;
    var name = document.getElementById("name").value;
    var birthDate = document.getElementById("date").value;
    var countryList = document.getElementById("countries");
    var idCountry = countryList.options[countryList.selectedIndex].value;
    var player = { id: id, name: name, birthDate: birthDate, idCountry: idCountry };
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    if (acao === "create") {
        xhr.onreadystatechange = function() {
            if ((xhr.readyState == XMLHttpRequest.DONE) && (this.status === 200)) {
                var newPlayer = new Player(xhr.response.insertId, name, birthDate, idCountry);
                info.players.push(newPlayer);
                info.showPlayers();
            }
        }
        xhr.open("POST", "http://localhost:8081/player", true);
    } else if (acao === "update") {
        xhr.onreadystatechange = function() {
            if ((xhr.readyState == XMLHttpRequest.DONE) && (this.status === 200)) {
                info.players.splice(info.players.findIndex(i => i.id === id), 1);
                info.players.push(player);
                info.showPlayers();
            }
        }
        xhr.open("PUT", "http://localhost:8081/player/" + id, true);
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(player));
}