import os
from pathlib import Path

try:
    from dotenv import load_dotenv

    env_path = Path(__file__).resolve().parent.parent / ".env"
    load_dotenv(env_path, override=False)
except ImportError:
    pass
