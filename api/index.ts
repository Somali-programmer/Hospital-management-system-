import app from '../server';

export default function handler(req: any, res: any) {
  // If Vercel stripped the /api/ prefix, Express routes won't match. We manually ensure it exists.
  if (req.url && !req.url.startsWith('/api/')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }
  return app(req, res);
}
