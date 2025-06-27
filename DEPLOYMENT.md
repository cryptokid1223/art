# Deployment Guide - Artwork Analyzer

This guide will help you deploy the Artwork Analyzer to Vercel and set up the OpenAI API integration.

## Prerequisites

1. **OpenAI API Key**: Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. **GitHub Account**: For version control and easy deployment
3. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)

## Step 1: Prepare Your Code

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Artwork Analyzer"
   git branch -M main
   git remote add origin https://github.com/yourusername/artwork-analyzer.git
   git push -u origin main
   ```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Project**
   - Click "New Project"
   - Select "Import Git Repository"
   - Choose your `artwork-analyzer` repository
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (should auto-detect)
   - **Output Directory**: `.next` (should auto-detect)
   - **Install Command**: `npm install` (should auto-detect)

4. **Set Environment Variables**
   - In the project settings, go to "Environment Variables"
   - Add the following variable:
     - **Name**: `OPENAI_API_KEY`
     - **Value**: Your OpenAI API key
     - **Environment**: Production, Preview, Development (check all)

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set Environment Variables**
   ```bash
   vercel env add OPENAI_API_KEY
   ```

## Step 3: Verify Deployment

1. **Check Your Live URL**
   - Vercel will provide a URL like: `https://your-project.vercel.app`
   - Visit the URL to ensure the app loads correctly

2. **Test the Upload Feature**
   - Try uploading an image
   - Check that the analysis works (requires OpenAI API key)

## Step 4: Custom Domain (Optional)

1. **Add Custom Domain**
   - Go to your project settings in Vercel
   - Navigate to "Domains"
   - Add your custom domain
   - Follow the DNS configuration instructions

## Troubleshooting

### Common Issues

1. **"Failed to analyze artwork" Error**
   - Check that `OPENAI_API_KEY` is set correctly in Vercel
   - Verify your OpenAI API key is valid and has credits
   - Check Vercel function logs for detailed error messages

2. **Build Failures**
   - Ensure all dependencies are in `package.json`
   - Check that TypeScript compilation passes locally
   - Review build logs in Vercel dashboard

3. **Function Timeout**
   - The API route is configured for 30-second timeout
   - If analysis takes longer, consider optimizing the GPT prompt

### Environment Variables

Make sure these are set in Vercel:
- `OPENAI_API_KEY`: Your OpenAI API key

### Function Configuration

The `vercel.json` file configures:
- Function timeout: 30 seconds
- Environment variable mapping

## Monitoring and Analytics

1. **Vercel Analytics**
   - Enable Vercel Analytics in your project settings
   - Monitor performance and usage

2. **Function Logs**
   - Check function logs in Vercel dashboard
   - Monitor API usage and errors

## Cost Optimization

1. **OpenAI API Usage**
   - Monitor your OpenAI API usage
   - Set up billing alerts
   - Consider implementing rate limiting

2. **Vercel Usage**
   - Monitor function execution time
   - Optimize for faster responses

## Security Considerations

1. **API Key Security**
   - Never commit API keys to Git
   - Use environment variables
   - Rotate keys regularly

2. **Rate Limiting**
   - Consider implementing rate limiting
   - Monitor for abuse

## Next Steps

After successful deployment:

1. **Test thoroughly** with various image types
2. **Monitor performance** and usage
3. **Consider adding features** like:
   - User authentication
   - Image storage
   - Analysis history
   - Social sharing

## Support

If you encounter issues:
1. Check Vercel function logs
2. Review OpenAI API documentation
3. Open an issue in the GitHub repository 