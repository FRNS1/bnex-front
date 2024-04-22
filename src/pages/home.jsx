import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Modal, TextField } from '@mui/material';
import {getAllProducts, getProductById, deleteProduct, updateProduct, createProduct, Produto}  from './services';
import CurrencyInput from 'react-currency-input-field';

const ProdutosTable = ({ produtos }) => {
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [newProdutoModalOpen, setNewProdutoModalOpen] = useState(false);
  const [produtoToUpdate, setProdutoToUpdate] = useState(null);
  const [produtoToDelete, setProdutoToDelete] = useState(null);
  const [newProduto, setNewProduto] = useState({ nome: '', descricao: '', valor: '' });

  const [products, setProducts] = useState();

  const handleUpdate = async (produto) => {
    await setProdutoToUpdate(produto);
    setUpdateModalOpen(true);
    console.log(produtoToUpdate);
  };

  const handleDelete = (produto) => {
    setProdutoToDelete(produto);
    setDeleteModalOpen(true);
    console.log(produtoToDelete);
  };

  const handleNewProduto = () => {
    setNewProdutoModalOpen(true);
  };

  const handleCloseModals = () => {
    setUpdateModalOpen(false);
    setDeleteModalOpen(false);
    setNewProdutoModalOpen(false);
  };

  const fetchProducts = async () => {
    const data = await getAllProducts();
    await setProducts(data);
  };

  const formatMoney = (value) => {
    value = value / 100;
    const parts = value.toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    if (parts[1].length === 1) {
      parts[1] += '0';
    }
    return `R$ ${parts.join(',')}`;
  };
  

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <Button onClick={handleNewProduto} variant="contained" color="primary">Cadastrar Novo Produto</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Valor</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products?.map((produto) => (
              <TableRow key={produto.id}>
                <TableCell>{produto.product_id}</TableCell>
                <TableCell>{produto.nome}</TableCell>
                <TableCell>{produto.descricao}</TableCell>
                <TableCell>{formatMoney(produto.valor)}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleUpdate(produto)}>Atualizar</Button>
                </TableCell>
                <TableCell>
                  <Button variant="contained" sx={{ bgcolor: 'red' }} onClick={() => handleDelete(produto)}>Excluir</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de Update */}
      <Modal open={updateModalOpen} onClose={handleCloseModals}>
        <div style={{ backgroundColor: 'white', padding: '20px' }}>
          <h2>Atualizar Produto</h2>
          <form>
            <TextField label="Nome" defaultValue={produtoToUpdate?.nome} onChange={(e) => setProdutoToUpdate({ ...produtoToUpdate, nome: e.target.value })} />
            <TextField label="Descrição" defaultValue={produtoToUpdate?.descricao} onChange={(e) => setProdutoToUpdate({ ...produtoToUpdate, descricao: e.target.value })} />
            <TextField label="Valor" defaultValue={produtoToUpdate?.valor} onChange={(e) => setProdutoToUpdate({ ...produtoToUpdate, valor: e.target.value })} />
            <Button type="button" variant="contained" onClick={() => updateProduct(produtoToUpdate)} color="primary">Enviar</Button>
            <Button onClick={handleCloseModals} variant="contained" sx={{ bgcolor: 'red' }} color="secondary">Cancelar</Button>
          </form>
        </div>
      </Modal>

      {/* Modal de Delete */}
      <Modal open={deleteModalOpen} onClose={handleCloseModals}>
        <div style={{ backgroundColor: 'white', padding: '20px' }}>
          <h2>Excluir Produto</h2>
          <p>Você tem certeza que deseja excluir o produto {produtoToDelete?.nome}?</p>
          <Button onClick={() => deleteProduct(produtoToDelete?.product_id)} variant="contained" color="primary">Sim</Button>
          <Button onClick={handleCloseModals} variant="contained" sx={{ bgcolor: 'red' }}>Cancelar</Button>
        </div>
      </Modal>

      {/* Modal de Novo Produto */}
      <Modal open={newProdutoModalOpen} onClose={handleCloseModals}>
        <div style={{ backgroundColor: 'white', padding: '20px' }}>
          <h2>Cadastrar Novo Produto</h2>
          <form>
            <TextField label="Nome" value={newProduto.nome} onChange={(e) => setNewProduto({ ...newProduto, nome: e.target.value })} />
            <TextField label="Descrição" value={newProduto.descricao} onChange={(e) => setNewProduto({ ...newProduto, descricao: e.target.value })} />
            <CurrencyInput label="Valor" 
            onChange={(e) => setNewProduto({ ...newProduto, valor: e.target.value })}
            allowDecimals={true}
            decimalsLimit={2}
            prefix="R$ "
            customInput={TextField}
            />
            <Button type="button" variant="contained" color="primary" onClick={() => createProduct(newProduto)}>Enviar</Button>
            <Button onClick={handleCloseModals} variant="contained" sx={{ bgcolor: 'red' }}>Cancelar</Button>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default ProdutosTable;