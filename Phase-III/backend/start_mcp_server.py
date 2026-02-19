#!/usr/bin/env python3
"""
MCP Server Startup Script

This script starts the MCP server for todo operations.
It can be run directly or imported for programmatic control.

Usage:
    python start_mcp_server.py

    Or as a module:
    python -m src.mcp.server
"""
import sys
import os
import logging
from pathlib import Path

# Add backend/src to Python path
backend_src = Path(__file__).parent / "src"
sys.path.insert(0, str(backend_src))

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('mcp_server.log')
    ]
)

logger = logging.getLogger(__name__)


def check_environment():
    """Verify required environment variables and dependencies"""
    required_vars = ['DATABASE_URL']
    missing_vars = [var for var in required_vars if not os.getenv(var)]

    if missing_vars:
        logger.error(f"Missing required environment variables: {', '.join(missing_vars)}")
        logger.error("Please set these in your .env file")
        return False

    # Check if MCP SDK is installed
    try:
        import mcp
        logger.info(f"MCP SDK version: {mcp.__version__}")
    except ImportError:
        logger.error("MCP SDK not installed. Run: pip install mcp")
        return False

    # Check if database connection works
    try:
        from database.database import engine
        with engine.connect() as conn:
            conn.execute("SELECT 1")
        logger.info("Database connection verified")
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        return False

    return True


def main():
    """Main entry point"""
    logger.info("=" * 60)
    logger.info("MCP Server Startup")
    logger.info("=" * 60)

    # Load environment variables
    try:
        from dotenv import load_dotenv
        load_dotenv()
        logger.info("Environment variables loaded from .env")
    except ImportError:
        logger.warning("python-dotenv not installed, using system environment")

    # Check environment
    if not check_environment():
        logger.error("Environment check failed. Exiting.")
        sys.exit(1)

    # Start MCP server
    logger.info("Starting MCP server...")
    try:
        from mcp.server import main as mcp_main
        import asyncio
        asyncio.run(mcp_main())
    except KeyboardInterrupt:
        logger.info("MCP server stopped by user")
    except Exception as e:
        logger.exception(f"MCP server crashed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
