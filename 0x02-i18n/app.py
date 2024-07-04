#!/usr/bin/env python3
"""Flask app."""
from flask_babel import Babel, gettext as _
from flask import Flask, render_template, request, g
import pytz
from pytz import exceptions as tz_exceptions
from datetime import datetime


class Config:
    """Flask Babel configuration."""
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app = Flask(__name__)
app.config.from_object(Config)
app.url_map.strict_slashes = False
babel = Babel(app)


users = {
    1: {"name": "Balou", "locale": "fr", "timezone": "Europe/Paris"},
    2: {"name": "Beyonce", "locale": "en", "timezone": "US/Central"},
    3: {"name": "Spock", "locale": "kg", "timezone": "Vulcan"},
    4: {"name": "Teletubby", "locale": None, "timezone": "Europe/London"},
}


def get_user() -> dict:
    """Return a user dictionary or None if the ID cannot be found."""
    login_as = request.args.get('login_as')
    if login_as:
        user_id = int(login_as)
        return users.get(user_id)
    return None


@app.before_request
def before_request():
    """Set user as a global on flask.g."""
    g.user = get_user()


@babel.localeselector
def get_locale() -> str:
    """The locale for a web page."""
    # Locale from URL parameters
    locale = request.args.get('locale')
    if locale in app.config['LANGUAGES']:
        return locale

    # Locale from user settings
    user = g.get('user')
    if user and user['locale'] in app.config['LANGUAGES']:
        return user['locale']

    # Locale from request header
    return request.accept_languages.best_match(app.config['LANGUAGES'])


@babel.timezoneselector
def get_timezone() -> str:
    """The timezone for a web page."""
    # Timezone from URL parameters
    timezone = request.args.get('timezone')
    if timezone:
        try:
            return pytz.timezone(timezone).zone
        except tz_exceptions.UnknownTimeZoneError:
            pass

    # Timezone from user settings
    user = g.get('user')
    if user:
        try:
            return pytz.timezone(user['timezone']).zone
        except tz_exceptions.UnknownTimeZoneError:
            pass

    # Default timezone
    return app.config['BABEL_DEFAULT_TIMEZONE']


@app.route('/')
def get_index() -> str:
    """Home/index page."""
    current_time = datetime.now(pytz.timezone(get_timezone())).strftime("%b %d, %Y, %I:%M:%S %p")
    return render_template('index.html', current_time=current_time)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)