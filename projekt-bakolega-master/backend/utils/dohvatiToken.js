const express = require('express');
const jwt = require('jsonwebtoken')

const dohvatiToken = req => {
    const auth = req.get('Authorization')
    if (auth && auth.toLowerCase().startsWith('bearer')) {
        return auth.substring(7)
    }
    return null
}

module.exports = {dohvatiToken}