import app from '../server';

export default function handler(req: any, res: any) {
  try {
    // If Vercel stripped the /api/ prefix, Express routes won't match. We manually ensure it exists.
    if (req.url && !req.url.startsWith('/api/')) {
      req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
    }
    return app(req, res);
  } catch (error: any) {
    console.error('CRITICAL STARTUP ERROR:', error);
    res.status(500).json({ 
      error: 'Critical Startup Error', 
      details: error.message,
      stack: error.stack 
    });
  }
}
