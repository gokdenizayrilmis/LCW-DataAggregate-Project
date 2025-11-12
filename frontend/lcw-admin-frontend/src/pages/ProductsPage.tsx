import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, TablePagination, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, Chip, Stack
} from '@mui/material';
import { Visibility } from '@mui/icons-material';
import AdminNavbar from '../components/AdminNavbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { staticProducts } from '../data/staticProducts';

interface ProductItem {
  id: number;
  name: string;
  code: string;
  category: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  useEffect(() => {
    setProducts(staticProducts);
  }, []);

  const handleOpenDetails = (product: ProductItem) => {
    setSelectedProduct(product);
    setDetailOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailOpen(false);
    setSelectedProduct(null);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AdminNavbar />
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'auto' }}>
          <Box sx={{ flexGrow: 1, p: 3, mt: 8 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 3 }}>Ürünler</Typography>

            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer sx={{ overflowX: 'hidden' }}>
                <Table stickyHeader size="small" sx={{ tableLayout: 'fixed', width: '100%' }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: 80 }}>Resim</TableCell>
                      <TableCell sx={{ width: 80 }}>Ad</TableCell>
                      <TableCell sx={{ width: 80 }}>Kod</TableCell>
                      <TableCell sx={{ width: 80 }}>Kategori</TableCell>
                      <TableCell sx={{ width: 80 }}>Fiyat</TableCell>
                      <TableCell sx={{ width: 80 }}>Stok</TableCell>
                      <TableCell align="left" sx={{ width: 80 }}>İşlemler</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((p) => (
                      <TableRow hover key={p.id}>
                        <TableCell sx={{width: 80 }}>
                          {p.imageUrl && (
                            <img
                              src={p.imageUrl}
                              alt={p.name}
                              style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                              onError={(e) => {
                                const target = e.currentTarget as HTMLImageElement;
                                const svg = encodeURIComponent(
                                  `<svg xmlns='http://www.w3.org/2000/svg' width='56' height='56'>\n` +
                                  `<rect width='100%' height='100%' fill='%23eceff1'/>\n` +
                                  `<text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%2390a4ae' font-size='10' font-family='Arial'>IMG</text>\n` +
                                  `</svg>`
                                );
                                target.src = `data:image/svg+xml;charset=utf-8,${svg}`;
                              }}
                            />
                          )}
                        </TableCell>
                        <TableCell sx={{ width: 220, maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          <span style={{ display: 'inline-block', maxWidth: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {p.name}
                          </span>
                        </TableCell>
                        <TableCell sx={{ width: 140, maxWidth: 140, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          <span style={{ display: 'inline-block', maxWidth: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {p.code}
                          </span>
                        </TableCell>
                        <TableCell sx={{ width: 120, maxWidth: 120, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          <span style={{ display: 'inline-block', maxWidth: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {p.category}
                          </span>
                        </TableCell>
                        <TableCell>{p.price.toLocaleString('tr-TR')} ₺</TableCell>
                        <TableCell>{p.stockQuantity}</TableCell>
                        <TableCell align="left" sx={{ width: 110, pl: 2 }}>
                          <Button 
                            size="small" 
                            variant="contained"
                            color="primary"
                            startIcon={<Visibility />} 
                            onClick={() => handleOpenDetails(p)} 
                            sx={{ 
                              whiteSpace: 'nowrap', 
                              px: 2, 
                              py: 0.5,
                              minWidth: 0,
                              fontSize: '0.8rem',
                              boxShadow: 1,
                              '&:hover': {
                                boxShadow: 2,
                              }
                            }}
                          >
                            İncele
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={products.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => { setRowsPerPage(+e.target.value); setPage(0); }}
                labelRowsPerPage="Sayfa başına satır:"
              />
            </Paper>
          </Box>
          <Footer />
        </Box>
      </Box>

      {/* Product Detail Dialog */}
      {selectedProduct && (
        <Dialog open={detailOpen} onClose={handleCloseDetails} maxWidth="md" fullWidth>
          <DialogTitle sx={{ fontWeight: 'bold' }}>{selectedProduct.name}</DialogTitle>
          <DialogContent dividers>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
              <Box>
                <img src={selectedProduct.imageUrl} alt={selectedProduct.name} style={{ width: '100%', height: 'auto', borderRadius: 8 }} />
              </Box>
              <Box>
                <Typography variant="h6" gutterBottom>Ürün Bilgileri</Typography>
                <Typography variant="body1" sx={{ mb: 1 }}><b>Kod:</b> {selectedProduct.code}</Typography>
                <Typography variant="body1" sx={{ mb: 1 }}><b>Kategori:</b> {selectedProduct.category}</Typography>
                <Typography variant="h5" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
                  {selectedProduct.price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                </Typography>
                
                <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold' }}>Bedenler:</Typography>
                <Stack direction="row" spacing={1}>
                  <Chip label="S" variant="outlined" />
                  <Chip label="M" variant="outlined" />
                  <Chip label="L" variant="outlined" />
                  <Chip label="XL" variant="outlined" />
                </Stack>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDetails}>Kapat</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default ProductsPage;
