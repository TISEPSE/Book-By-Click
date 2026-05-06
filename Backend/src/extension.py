# -*- coding: utf-8 -*-
"""
Initialisation des extensions Flask.

Les instances sont créées ici sans être attachées à une application,
conformément au pattern Application Factory. L'association se fait
dans create_app() via db.init_app(app) et migrate.init_app(app, db).
"""

from flask_sqlalchemy import SQLAlchemy
from flask_cors       import CORS
from flask_migrate    import Migrate

db      = SQLAlchemy()
cors    = CORS
migrate = Migrate()
