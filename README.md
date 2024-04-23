# Mutual Funds Analysis Tool

This project is a Mutual Funds Analysis tool that provides various graphs representing different investment scenarios. The tool is designed to help users understand the performance of various mutual funds over time, and even compare them aginst indices. Various indices can also be compared against each other.

## Graphs

The tool provides the following types of graphs:

- NAV
- SIP Rolling Returns
- SIP Rolling Absolute Value
- Lumpsum Rolling Returns
- Lumpsum Rolling Absolute Value
- Standard Deviation Rolling Annualized Monthly

Details about each graph can be found in the [wiki](https://asrajavel.github.io/mf-analysis/wiki.html).

Each graph represents a different investment scenario and provides insights into the performance of the mutual funds. The data can be alaysed for differnt rolling time periods - 1, 3, 5 and 10 years.

## Data Source

The data for these graphs is sourced from niftyindices.com and mfapi.in. The website performs all calculations on the client-side, including XIRR for different investment durations, and stores precalculated values for XIRR to improve performance.

## Risk Measurement

The website also provides a measure of risk by calculating the standard deviation of monthly returns. This helps users understand the volatility of the mutual funds.

## Privacy

All the logic for the website is contained in JavaScript files, and no data leaves the user's browser. The website does not use backend servers. This ensures the privacy and security of the user's data.

## License

The project is released under the MIT License. Please see the `LICENSE.txt` file for more details.