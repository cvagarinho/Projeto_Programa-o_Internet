"use strict";
const mysql = require("mysql");
const options = require("./connectionOptions.json");

/**
 * Função para retornar a lista de pessoas da BD.
 * @param {*} req 
 * @param {*} res 
 */
function getPlayers(req, res) {
    var connection = mysql.createConnection(options);
    connection.connect();
    var query = "SELECT id, name, birthDate, idCountry FROM player";
    connection.query(query, function(err, rows) {
        if (err) {
            res.json({ "Erro": true, "Message": "Error MySQL query to player table" });
        } else {
            res.json({ "Ok": false, "Message": "Success", "player": rows });
        }
    });
}
module.exports.getPlayers = getPlayers;

/**
 * Função para retornar a lista de paises da BD.
 * @param {*} req 
 * @param {*} res 
 */
function getCountries(req, res) {
    var connection = mysql.createConnection(options);
    connection.connect();
    var query = "SELECT id, name, shortName FROM country";
    connection.query(query, function(err, rows) {
        if (err) {
            res.json({ "Erro": true, "Message": "Error MySQL query to country table" });
        } else {
            res.json({ "Ok": false, "Message": "Success", "country": rows });
        }
    });
}
module.exports.getCountries = getCountries;

/**
 * Função que permite criar ou editar uma pessoa, consoante o pedido enviado pelo cliente.
 * 
 * @param {Object} request pedido do cliente
 * @param {Object} response resposta do servidor
 */
function createUpdatePlayer(req, res) {
    var connection = mysql.createConnection(options);
    connection.connect();
    var name = req.body.name;
    var birthDate = (req.body.birthDate) ? req.body.birthDate : null;
    var idCountry = (req.body.idCountry) ? req.body.idCountry : null;
    var sql;
    if (req.method === "PUT") {
        sql = mysql.format("UPDATE player SET name=?, birthdate=?, idCountry=? WHERE id=?", [name, birthDate, idCountry, req.params.id]);
    } else {
        if (req.method === "POST") {
            sql = mysql.format("INSERT INTO player(name, birthdate, idCountry) VALUES (?,?,?,?)", [name, birthDate, idCountry]);
        }
    }
    connection.query(sql, function(err, rows, fields) {
        if (err) {
            console.log(err);
            res.sendStatus(404);
        } else {
            res.send(rows);
        }
    });
    connection.end();
}
module.exports.createUpdatePlayer = createUpdatePlayer;

/**
 * Função que permite remover uma pessoa
 * 
 * @param {Object} request pedido do cliente
 * @param {Object} response resposta do servidor
 */
function removePlayer(req, res) {
    var connection = mysql.createConnection(options);
    connection.connect();
    var sql = mysql.format("DELETE FROM player WHERE id = ?", [req.params.id]);
    connection.query(sql,
        function(err, rows, fields) {
            if (err) {
                res.sendStatus(404);
            } else {
                res.send();
            }
        });
    connection.end();
}
module.exports.removePlayer = removePlayer;