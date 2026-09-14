# GoWorking Four-Service Repository Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the Vue client, Vue admin, Spring Boot service, and Django crawler service in one repository with safe environment configuration, complete dependencies, and explicit command-based deployment instructions.

**Architecture:** Keep each application in its own top-level directory and run each process independently. Django owns crawler and scheduled-task work, Spring Boot owns application APIs, and both Vue applications consume backend APIs. Secrets remain in ignored `.env` or local properties files while tracked example files document every required variable.

**Tech Stack:** Vue 3, Vite, Node.js/npm, Spring Boot 3.4, Java 21, Maven Wrapper, Django 5.2.17, Python 3.11, Conda, PyMySQL 1.2.0, python-dotenv, MySQL

**Spec:** `docs/superpowers/specs/2026-09-14-four-service-repository-design.md`

## Global Constraints

- The repository contains exactly four application directories: `client/`, `admin/`, `service/`, and `message-service/`.
- Do not add or retain a Shell one-click startup script.
- Do not commit real JWT keys, Django secret keys, database passwords, IDE metadata, Python caches, SQLite databases, frontend build output, or Java build output.
- Client uses port `5173`, admin uses port `5172`, Spring Boot uses its existing configured port, and Django uses port `8000`.
- Django uses the Conda environment named exactly `MessageService`.
- Keep the user's existing uncommitted Spring security and job-position work intact and include it in verification.

---

### Task 1: Add the Django Service as a Clean Repository Module

**Files:**
- Create: `message-service/manage.py`
- Create: `message-service/MsgService/__init__.py`
- Create: `message-service/MsgService/asgi.py`
- Create: `message-service/MsgService/settings.py`
- Create: `message-service/MsgService/urls.py`
- Create: `message-service/MsgService/wsgi.py`
- Create: `message-service/user/urls.py`
- Create: `message-service/user/views.py`
- Create: `message-service/.gitignore`
- Create: `message-service/.env.example`
- Create locally but do not track: `message-service/.env`
- Create: `message-service/requirements.txt`
- Create: `message-service/tests/__init__.py`
- Test: `message-service/tests/test_settings.py`

**Interfaces:**
- Consumes: the current Django project at `../../MessageService/MsgService` relative to the repository root.
- Produces: a runnable Django project configured by `DJANGO_SECRET_KEY`, `DJANGO_DEBUG`, `DJANGO_ALLOWED_HOSTS`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, and `DB_PORT`.

- [ ] **Step 1: Copy only Django source files into `message-service/`**

Copy `manage.py`, the `MsgService/` Python package, and the `user/` Python package. Exclude `.idea/`, every `__pycache__/`, `*.pyc`, and `db.sqlite3`.

- [ ] **Step 2: Create dependencies and ignore rules**

`message-service/requirements.txt` must contain:

```text
Django==5.2.17
PyMySQL==1.2.0
python-dotenv==1.1.1
```

`message-service/.gitignore` must contain:

```text
.env
__pycache__/
*.py[cod]
db.sqlite3
.idea/
.pytest_cache/
```

- [ ] **Step 3: Write the failing settings test**

Create `message-service/tests/test_settings.py`:

```python
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
```

- [ ] **Step 4: Run the settings test and verify RED**

Run:

```bash
cd message-service
conda run -n MessageService python -m unittest tests.test_settings -v
```

Expected: FAIL because the copied settings still contain hard-coded values.

- [ ] **Step 5: Implement environment-backed Django settings**

At the beginning of `message-service/MsgService/settings.py`, load the local environment file:

```python
import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")
```

Replace security and database values with:

```python
SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]
DEBUG = os.getenv("DJANGO_DEBUG", "false").lower() == "true"
ALLOWED_HOSTS = [host.strip() for host in os.getenv("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1").split(",") if host.strip()]

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": os.getenv("DB_NAME", "FindWorking"),
        "USER": os.getenv("DB_USER", "root"),
        "PASSWORD": os.environ["DB_PASSWORD"],
        "HOST": os.getenv("DB_HOST", "127.0.0.1"),
        "PORT": os.getenv("DB_PORT", "3306"),
    }
}
```

- [ ] **Step 6: Create safe example and ignored local environment files**

Track `message-service/.env.example` with placeholders only:

```dotenv
DJANGO_SECRET_KEY=replace-with-a-long-random-secret
DJANGO_DEBUG=true
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
DB_NAME=FindWorking
DB_USER=root
DB_PASSWORD=replace-with-your-database-password
DB_HOST=127.0.0.1
DB_PORT=3306
```

Create ignored `message-service/.env` using the current local Django values without printing them or staging the file.

- [ ] **Step 7: Run Django tests and checks**

Run:

```bash
cd message-service
conda run -n MessageService python -m unittest tests.test_settings -v
conda run -n MessageService python manage.py check
```

Expected: test PASS and `System check identified no issues`.

- [ ] **Step 8: Commit the Django module**

```bash
git add message-service .gitignore
git commit -m "feat: add Django crawler service"
```

Before committing, run `git status --short --ignored message-service` and verify `.env`, caches, IDE files, and SQLite files are ignored rather than staged.

### Task 2: Replace the Old Startup Script with Command-Based Deployment Documentation

**Files:**
- Modify: `README.md`
- Delete: `start-frontends.sh`
- Delete: `tests/startFrontends.test.js`

**Interfaces:**
- Consumes: the four top-level application directories and their dependency manifests.
- Produces: copy-paste commands for installation, configuration, database migration, development startup, and production builds.

- [ ] **Step 1: Remove obsolete startup artifacts**

Delete `start-frontends.sh` and `tests/startFrontends.test.js`. Leave other tests untouched.

- [ ] **Step 2: Rewrite the root README directory and prerequisites sections**

Document the four modules and require Node.js 20+, npm, Java 21, MySQL 8+, Conda, and the Maven Wrapper included in `service/`.

- [ ] **Step 3: Document initial configuration commands**

Include commands to copy safe examples:

```bash
cp service/.env.example service/.env
cp message-service/.env.example message-service/.env
```

Explain that real database passwords and secret keys must be edited locally and never committed.

- [ ] **Step 4: Document client and admin commands**

```bash
cd client
npm install
npm run dev -- --port 5173
```

```bash
cd admin
npm install
npm run dev -- --port 5172
```

- [ ] **Step 5: Document Spring Boot and Django commands**

```bash
cd service
./mvnw spring-boot:run
```

```bash
cd message-service
conda activate MessageService
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

Also provide the non-activated Conda alternative:

```bash
conda run -n MessageService python manage.py runserver 0.0.0.0:8000
```

- [ ] **Step 6: Document production build and validation commands**

Include `npm run build` for both Vue modules, `./mvnw test` and `./mvnw clean package` for Spring Boot, and `python manage.py check --deploy` as a pre-deployment Django check. State that Django's built-in `runserver` is for development only.

- [ ] **Step 7: Verify documentation commands against manifests**

Run:

```bash
npm --prefix client run build
npm --prefix admin run build
conda run -n MessageService python -m pip install -r message-service/requirements.txt
conda run -n MessageService python message-service/manage.py check
```

Expected: both Vue builds and Django checks exit `0`.

- [ ] **Step 8: Commit deployment documentation**

```bash
git add README.md start-frontends.sh tests/startFrontends.test.js
git commit -m "docs: add four-service deployment guide"
```

### Task 3: Verify and Commit Existing Spring Boot Changes

**Files:**
- Modify: `.gitignore`
- Modify: `service/src/main/java/com/wzbc/GoWorking/entity/DTO/Token/TokenUserDTO.java`
- Create: `service/.env.example`
- Create: `service/src/main/java/com/wzbc/GoWorking/entity/DTO/Token/JwtSecretProvider.java`
- Create: `service/src/main/java/com/wzbc/GoWorking/entity/PO/Job/JobPositionPO.java`
- Create: `service/src/main/resources/database/job_position.sql`
- Create: `service/src/test/java/com/wzbc/GoWorking/entity/DTO/Token/JwtSecretProviderTests.java`

**Interfaces:**
- Consumes: local `service/.env` containing `JWT_SECRET` and existing Spring datasource configuration.
- Produces: secure JWT loading and the cleaned `job_position` persistence model and schema.

- [ ] **Step 1: Review the existing diff without changing unrelated files**

Run:

```bash
git diff -- .gitignore service
git status --short --ignored service
```

Confirm `service/.env` is ignored and `service/.env.example` contains only a placeholder.

- [ ] **Step 2: Run the focused JWT tests**

```bash
cd service
./mvnw -Dtest=JwtSecretProviderTests test
```

Expected: 3 tests pass.

- [ ] **Step 3: Run the complete Spring Boot test suite**

```bash
cd service
./mvnw -DargLine=-javaagent:/Users/caihaoyang/.m2/repository/org/mockito/mockito-core/5.14.2/mockito-core-5.14.2.jar test
```

Expected: all tests pass with zero failures and zero errors.

- [ ] **Step 4: Commit the Spring changes**

```bash
git add .gitignore service/.env.example service/src
git commit -m "feat: secure service configuration and add job schema"
```

### Task 4: Final Security, Build, and Repository Verification

**Files:**
- Verify only; no planned production changes.

**Interfaces:**
- Consumes: all four completed modules.
- Produces: evidence that the branch is buildable, credential-safe, and ready to push.

- [ ] **Step 1: Run all module verification commands fresh**

```bash
npm --prefix client run build
npm --prefix admin run build
cd service && ./mvnw -DargLine=-javaagent:/Users/caihaoyang/.m2/repository/org/mockito/mockito-core/5.14.2/mockito-core-5.14.2.jar test
cd ../message-service && conda run -n MessageService python -m unittest discover -s tests -v
conda run -n MessageService python manage.py check
```

Expected: every command exits `0`.

- [ ] **Step 2: Check tracked files for credential leaks**

Run `git grep` for the known local database password, the old Django insecure key prefix, and the old hard-coded JWT key prefix. Expected: no matches. Also verify no tracked `.env`, `application.properties`, `db.sqlite3`, `.idea`, `__pycache__`, `node_modules`, `dist`, or `target` paths.

- [ ] **Step 3: Review the branch diff and commit history**

```bash
git diff --check origin/feature/showcase-page...HEAD
git status --short
git log --oneline origin/feature/showcase-page..HEAD
```

Expected: no whitespace errors, only intended working-tree changes before the final commit, and clear atomic commits.

- [ ] **Step 4: Push the verified branch**

```bash
git push origin feature/showcase-page
```

- [ ] **Step 5: Confirm remote synchronization**

```bash
git status -sb
git rev-parse HEAD
git rev-parse origin/feature/showcase-page
```

Expected: local and remote revisions match and the working tree is clean.
