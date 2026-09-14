import importlib
import os
from unittest import TestCase
from unittest.mock import patch


class EnvironmentSettingsTests(TestCase):
    def test_database_and_security_settings_use_environment(self):
        variables = {
            "DJANGO_SECRET_KEY": "test-secret",
            "DJANGO_DEBUG": "false",
            "DJANGO_ALLOWED_HOSTS": "localhost,127.0.0.1",
            "DB_NAME": "test_db",
            "DB_USER": "test_user",
            "DB_PASSWORD": "test_password",
            "DB_HOST": "db.example.test",
            "DB_PORT": "3307",
        }
        with patch.dict(os.environ, variables, clear=False):
            from MsgService import settings

            importlib.reload(settings)

        self.assertEqual(settings.SECRET_KEY, "test-secret")
        self.assertFalse(settings.DEBUG)
        self.assertEqual(settings.ALLOWED_HOSTS, ["localhost", "127.0.0.1"])
        self.assertEqual(settings.DATABASES["default"]["NAME"], "test_db")
        self.assertEqual(settings.DATABASES["default"]["USER"], "test_user")
        self.assertEqual(settings.DATABASES["default"]["PASSWORD"], "test_password")
        self.assertEqual(settings.DATABASES["default"]["HOST"], "db.example.test")
        self.assertEqual(settings.DATABASES["default"]["PORT"], "3307")
