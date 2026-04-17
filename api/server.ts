import app from '../server';
import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // If Vercel stripped the /api/ prefix, Express routes won't match. We manually ensure it exists.
  if (req.url && !req.url.startsWith('/api/')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }
  
  return app(req as any, res as any);
}
