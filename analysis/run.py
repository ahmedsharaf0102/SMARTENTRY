import os
import sys
from dotenv import load_dotenv
from pathlib import Path

# Load from .env if running locally
ENV_PATH = Path(__file__).resolve().parent / '.env'
load_dotenv(dotenv_path=ENV_PATH)

SUPABASE_URL = os.getenv('SUPABASE_URL') or os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_KEY') or os.getenv('SUPABASE_SERVICE_ROLE_KEY')

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ Error: Supabase credentials not found in environment.")
    sys.exit(1)

# Import engine functions after env vars are loaded
from app import run_analysis, run_gold_analysis

def main():
    print("🚀 Starting SmartEntry Automated Analysis via GitHub Actions...\n")
    
    try:
        print("📈 1. Analyzing Crypto Markets...")
        run_analysis()
        
        print("\n🥇 2. Analyzing Gold (Macro & Tech)...")
        run_gold_analysis()
        
        print("\n✅ All analysis completed successfully!")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ FATAL ERROR during analysis: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
