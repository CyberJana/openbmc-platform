"""OpenBMC Firmware Research Platform - Backend Application"""

__version__ = "1.0.0"
__author__ = "OpenBMC Research Team"
__email__ = "team@openbmc.local"
__license__ = "Apache 2.0"

from app.main import app

__all__ = ["app"]