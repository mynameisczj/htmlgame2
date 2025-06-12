// GitHub Pages API端点处理脚本
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const data = req.body;
    const timestamp = new Date().toISOString();
    
    // 触发GitHub Actions工作流 (Token通过GitHub Secrets安全传递)
    if (!process.env.GITHUB_TOKEN || !process.env.REPO_OWNER || !process.env.REPO_NAME) {
      throw new Error('Missing required environment variables');
    }
    
    const response = await fetch(`https://api.github.com/repos/${process.env.REPO_OWNER}/${process.env.REPO_NAME}/dispatches`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.everest-preview+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        event_type: 'experiment_data',
        client_payload: data
      })
    });

    if (!response.ok) {
      throw new Error('Failed to trigger workflow');
    }

    res.status(200).send('Data submitted successfully');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
};
