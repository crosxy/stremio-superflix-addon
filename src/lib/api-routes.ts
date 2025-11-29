import express from 'express';
import * as addon from './addon-server';

export const router = express.Router();

router.get('/manifest.json', (req, res) => res.json(addon.getManifest()));

router.get('/catalog/:type/:id', async (req, res) => {
  res.json(await addon.getCatalog(req.params.type, req.params.id, req.query));
});

router.get('/meta/:type/:id', async (req, res) => {
  res.json(await addon.getMeta(req.params.type, req.params.id));
});

router.get('/stream/:type/:id', async (req, res) => {
  res.json(await addon.getStream(req.params.type, req.params.id));
});
