module.exports = {
    getTelaInicial: (req, res) => {
        res.render('index.ejs', {
            titulo: "Inicio",
            subtitulo: "Atividade prática da disciplina de Banco de Dados 2018-2.",
            icone: 'fas fa-home'
        });
    },
};