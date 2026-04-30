#!/bin/bash
# ═══════════════════════════════════════════════════
# SmartEntry — Oracle VM Setup Script
# Run this on your Oracle Cloud VM (Ubuntu/Oracle Linux)
# ═══════════════════════════════════════════════════

set -e

echo "🚀 SmartEntry Analysis Engine — Setup"
echo "════════════════════════════════════════"

# Step 1: Update system
echo "📦 Updating system..."
sudo apt update && sudo apt upgrade -y 2>/dev/null || sudo dnf update -y

# Step 2: Install Python 3.11+ and pip
echo "🐍 Installing Python..."
sudo apt install -y python3 python3-pip python3-venv git 2>/dev/null || \
sudo dnf install -y python3 python3-pip git

# Step 3: Clone the repo
echo "📂 Cloning SmartEntry..."
cd ~
if [ -d "SMARTENTRY" ]; then
  cd SMARTENTRY && git pull
else
  git clone https://github.com/ahmedsharaf0102/SMARTENTRY.git
  cd SMARTENTRY
fi

# Step 4: Setup Python virtual environment
echo "🔧 Setting up virtual environment..."
cd analysis
python3 -m venv venv
source venv/bin/activate

# Step 5: Install dependencies
echo "📦 Installing Python packages..."
pip install --upgrade pip
pip install -r requirements.txt

# Step 6: Create .env file
echo "🔐 Creating .env file..."
if [ ! -f .env ]; then
cat > .env << 'EOF'
# Supabase (service role — bypasses RLS)
SUPABASE_URL=https://jemalqgdlnzftjpymqwz.supabase.co
SUPABASE_SERVICE_KEY=YOUR_SERVICE_ROLE_KEY_HERE

# Flask
PORT=5000
EOF
echo "⚠️  EDIT .env and replace YOUR_SERVICE_ROLE_KEY_HERE with your actual key!"
echo "    Run: nano .env"
else
echo "✅ .env already exists"
fi

# Step 7: Test run
echo ""
echo "════════════════════════════════════════"
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Edit the .env file:  nano .env"
echo "  2. Add your SUPABASE_SERVICE_KEY"
echo "  3. Run analysis:  source venv/bin/activate && python app.py"
echo "  4. To run in background:  nohup python app.py > analysis.log 2>&1 &"
echo ""
echo "To set up auto-run every 5 minutes, add this cron:"
echo "  crontab -e"
echo "  */5 * * * * cd ~/SMARTENTRY/analysis && source venv/bin/activate && python -c 'from app import run_analysis; run_analysis()' >> ~/analysis.log 2>&1"
echo "════════════════════════════════════════"
