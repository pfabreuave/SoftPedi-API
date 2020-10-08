const express = require('express')
const { Sequelize, DataTypes } = require('sequelize')
const produto = require('./models/produto')
const mesa = require('./models/mesa')
const pedido = require('./models/pedido')

const app = express()
const sequelize = new Sequelize({ dialect: 'sqlite', storage: './restaurant.db' })
const produtos = produto(sequelize, DataTypes)
const mesas = mesa(sequelize, DataTypes)
const pedidos = pedido(sequelize, DataTypes)



// We need to parse JSON coming from requests
app.use(express.json())



// Show mesa
app.get('/mesas/:id', async (req, res) => {
  const mesaId = req.params.id
  const mesa = await mesas.findByPk(mesaId);
  if (mesa) {
    res.json(mesa);
  } else {
    res.json({ resposta: 'Mesa não existe' })
  }
 });


 
// Show produto
app.get('/produtos/:id', async (req, res) => {
  const produtoId = req.params.id
  const produto = await produtos.findByPk(produtoId);
  if (produto) {
    res.json(produto);
  } else {
    res.json({ resposta: 'Produto não existe' })
  } 
});
 

// Show pedido
app.get('/pedidos/:id', async (req, res) => {
  const pedidoId = req.params.id
  const pedido = await pedidos.findByPk(pedidoId);
  if (pedido) {
    res.json(pedido);
  } else {
    res.json({ resposta: 'Pedido não existe' })
  }  
});

// List pedidos
   app.get('/pedidos', async (req, res) => {
  //res.json({ action: 'Listing pedidos' })
  
  const allPedidos = await pedidos.findAll();
  if (allPedidos.length != 0) {
    res.json(allPedidos); 
  } else {
    res.json({ resposta: 'Pedidos não existen' })
  }   
});



// List pedidos por mesa
app.get('/mesas/:mesa/pedidos', async (req, res) => {
  //res.json({ action: 'Listing pedidos' })
  const MesaId = req.params.mesa;
  const allPedidos = await pedidos.findAll({where: {mesaid:MesaId}});
  if (allPedidos.length != 0) {
    res.json(allPedidos); 
  } else {
    res.json({ resposta: 'Não existe Pedido para a Mesa' })
  }  
 
  });


// Create pedido
  app.post('/pedido', async (req, res) => {
  const body = req.body

  await pedidos.create({
    productId: body.productId,
    mesaid: body.mesaid,
    status_pedido: body.status_pedido,
    is_active: body.is_active

  }); 
  
  res.json({resposta:"Pedido criado",data:body})
});

  // Delete pedido

app.delete('/pedido/:id', async (req, res) => {
  const pedidoId = req.params.id

  const isPresent = await pedidos.destroy({where: {id:pedidoId}});
  if (isPresent) {
    res.json({ resposta: 'Pedido excluido', Id: pedidoId })
  } else {
    res.json({ resposta: 'Pedido não existe' })
}
});

// Update pedido
app.put('/pedido/:id', async (req, res) => {
  const pedidoId = req.params.id
  const body = req.body
  const prod = await pedidos.findByPk(pedidoId);
  if (prod) {  
      prod.update({
      productId: body.productId,
      mesaid: body.mesaid,
      status_pedido: body.status_pedido,
      is_active: body.is_active
      }); 
      res.json({resposta:"Pedido Alterado",data:prod, atualizacao:body})
  } else {  
      res.json({ resposta: 'Pedido não existe' })
  } 
});

  app.listen(3000, () => {
    console.log('Iniciando o ExpressJS na porta 3000')
  })

