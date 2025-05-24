import express from 'express';
import myListController from '../controllers/myList';

const router = express.Router();

router.post('/myList', myListController.addToList!);
router.delete('/myList', myListController.removeFromList!);
router.get('/myList/:userId',myListController.getMyList!);

export default router;