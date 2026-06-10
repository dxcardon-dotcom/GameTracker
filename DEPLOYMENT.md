# GameTracker Deployment Guide

This guide provides step-by-step instructions for deploying GameTracker to various platforms.

## 🚀 Quick Deployment Options

### Option 1: Vercel (Recommended)
Vercel provides the easiest deployment experience with automatic CI/CD, custom domains, and excellent performance.

#### Prerequisites
- Node.js 18+ installed
- Vercel account (sign up at [vercel.com](https://vercel.com))
- GitHub repository with your code

#### Steps
1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from project root**
   ```bash
   cd frontend
   npm install
   npm run build
   vercel --prod
   ```

4. **Or use the automated script**
   ```bash
   cd frontend
   ./deploy-vercel.sh
   ```

#### Environment Variables
Set these in your Vercel dashboard:
- `VITE_API_BASE_URL`: Your backend API URL
- `VITE_DEFAULT_TEAM_ID`: Default team ID
- `VITE_DEFAULT_LIVE_GAME_ID`: Default live game ID

### Option 2: GitHub Pages (Free)
GitHub Pages provides free hosting for static sites.

#### Prerequisites
- GitHub account
- GitHub repository with your code
- GitHub CLI installed

#### Steps
1. **Install GitHub CLI**
   ```bash
   # macOS
   brew install gh
   
   # Ubuntu/Debian
   curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
   echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
   sudo apt update && sudo apt install gh
   ```

2. **Authenticate with GitHub**
   ```bash
   gh auth login
   ```

3. **Deploy using the script**
   ```bash
   cd frontend
   ./deploy-github-pages.sh
   ```

#### Manual Deployment
1. **Configure Vite for GitHub Pages**
   ```javascript
   // vite.config.js
   export default defineConfig({
     base: '/your-repo-name/',
     build: {
       outDir: 'dist'
     }
   })
   ```

2. **Build and deploy**
   ```bash
   npm install
   npm run build
   npm install --save-dev gh-pages
   npx gh-pages --dist dist
   ```

3. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Settings → Pages
   - Source: Deploy from a branch
   - Branch: gh-pages

### Option 3: Netlify
Netlify provides excellent features with a generous free tier.

#### Steps
1. **Push your code to GitHub**
2. **Sign up at [netlify.com](https://netlify.com)**
3. **Connect your GitHub repository**
4. **Configure build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18

5. **Add environment variables** in Netlify dashboard

### Option 4: AWS S3 + CloudFront
For enterprise-level deployments.

#### Prerequisites
- AWS account
- AWS CLI installed
- S3 bucket created
- CloudFront distribution configured

#### Steps
1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to S3**
   ```bash
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

3. **Invalidate CloudFront cache**
   ```bash
   aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
   ```

## 🔧 Configuration

### Environment Variables
Create a `.env.production` file in the frontend directory:

```env
VITE_API_BASE_URL=https://your-api-domain.com
VITE_DEFAULT_TEAM_ID=your-team-id
VITE_DEFAULT_LIVE_GAME_ID=your-live-game-id
```

### Build Optimization
The build is already optimized with:
- Code splitting
- Tree shaking
- Image optimization
- Gzip compression
- Browser caching

## 🌍 Custom Domains

### Vercel
1. Go to your Vercel dashboard
2. Project Settings → Domains
3. Add your custom domain
4. Configure DNS records as instructed

### GitHub Pages
1. Go to repository Settings → Pages
2. Add your custom domain
3. Configure DNS records with your provider

### Netlify
1. Site settings → Domain management
2. Add custom domain
3. Follow DNS configuration instructions

## 🔒 HTTPS/SSL

All recommended platforms provide automatic SSL certificates:
- **Vercel**: Automatic SSL for all deployments
- **GitHub Pages**: Automatic SSL for custom domains
- **Netlify**: Automatic SSL for all sites
- **AWS**: Use AWS Certificate Manager with CloudFront

## 📊 Performance Monitoring

### Vercel Analytics
Enable in your Vercel dashboard for real-time performance metrics.

### Google Analytics
Add to your `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🔄 CI/CD Automation

### GitHub Actions (Already Configured)
The `.github/workflows/ci-cd.yml` file provides:
- Automated testing on push
- Security scanning
- Performance testing
- Automatic deployment to staging/production

### Manual Deployment
For manual deployments, use the provided scripts:
```bash
# Vercel
./deploy-vercel.sh

# GitHub Pages
./deploy-github-pages.sh
```

## 🐛 Troubleshooting

### Common Issues

#### Build Fails
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Check for errors
npm run build
```

#### Deployment Fails
- Check environment variables
- Verify build output in `dist/` folder
- Check platform-specific requirements

#### 404 Errors on Refresh
- Ensure proper routing configuration
- Check `base` path in `vite.config.js`
- Verify server-side routing setup

#### Images Not Loading
- Check image paths and imports
- Verify build optimization settings
- Check CDN configuration

### Performance Issues

#### Slow Load Times
- Enable code splitting
- Optimize images
- Use CDN
- Enable compression

#### High Memory Usage
- Check for memory leaks
- Optimize bundle size
- Use lazy loading

## 📱 Mobile Optimization

The application is fully responsive and optimized for mobile devices:
- Touch-friendly interfaces
- Optimized images
- Fast loading
- Progressive Web App features

## 🔐 Security Considerations

### Environment Variables
- Never commit `.env` files
- Use platform-specific environment variable management
- Regularly rotate API keys

### HTTPS
- Always use HTTPS in production
- Implement HSTS headers
- Use secure cookies

### Content Security Policy
Add to your HTML head:
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;">
```

## 📈 Scaling Considerations

### Database Scaling
- Use connection pooling
- Implement read replicas
- Consider database sharding

### CDN Usage
- Serve static assets via CDN
- Implement edge caching
- Use regional deployments

### Load Balancing
- Use platform load balancers
- Implement health checks
- Configure auto-scaling

## 🆘 Support

### Documentation
- Check this guide first
- Review platform-specific documentation
- Check GitHub issues

### Community
- Join our Discord community
- Check GitHub Discussions
- Follow our Twitter for updates

### Direct Support
- Create a GitHub issue for bugs
- Contact support for enterprise plans
- Check our FAQ for common questions

---

## 🎉 Deployment Checklist

Before deploying to production:

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Build optimization verified
- [ ] Security headers configured
- [ ] HTTPS enabled
- [ ] Custom domain configured (if applicable)
- [ ] Analytics tracking set up
- [ ] Performance monitoring enabled
- [ ] Backup strategy in place
- [ ] Rollback plan prepared

Once deployed:

- [ ] Verify all functionality works
- [ ] Check mobile responsiveness
- [ ] Test performance metrics
- [ ] Monitor error logs
- [ ] Update documentation

---

**Happy deploying! 🚀**
