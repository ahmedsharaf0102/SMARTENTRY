"""Utility helpers for the analysis engine."""


def format_price(price: float) -> str:
    """Format price for display."""
    if price >= 1:
        return f'{price:,.2f}'
    return f'{price:.8f}'


def format_percentage(value: float) -> str:
    """Format percentage with sign."""
    sign = '+' if value >= 0 else ''
    return f'{sign}{value:.2f}%'
