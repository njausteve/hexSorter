module.exports = {
        strPad: function(input, padLength, padString, padType) {
            // eslint-disable-line camelcase
            //  discuss at: http://locutus.io/php/str_pad/
            // original by: Kevin van Zonneveld (http://kvz.io)
            // improved by: Michael White (http://getsprink.com)
            //    input by: Marco van Oort
            // bugfixed by: Brett Zamir (http://brett-zamir.me)
            //   example 1: strPad('Kevin van Zonneveld', 30, '-=', 'STR_PAD_LEFT')
            //   returns 1: '-=-=-=-=-=-Kevin van Zonneveld'
            //   example 2: strPad('Kevin van Zonneveld', 30, '-', 'STR_PAD_BOTH')
            //   returns 2: '------Kevin van Zonneveld-----'

            var half = ''
            var padToGo

            var _strPadRepeater = function(s, len) {
                var collect = ''

                while (collect.length < len) {
                    collect += s
                }
                collect = collect.substr(0, len)

                return collect
            }

            input += ''
            padString = padString !== undefined ? padString : ' '

            if (padType !== 'STR_PAD_LEFT' && padType !== 'STR_PAD_RIGHT' && padType !== 'STR_PAD_BOTH') {
                padType = 'STR_PAD_RIGHT'
            }
            if ((padToGo = padLength - input.length) > 0) {
                if (padType === 'STR_PAD_LEFT') {
                    input = _strPadRepeater(padString, padToGo) + input
                } else if (padType === 'STR_PAD_RIGHT') {
                    input = input + _strPadRepeater(padString, padToGo)
                } else if (padType === 'STR_PAD_BOTH') {
                    half = _strPadRepeater(padString, Math.ceil(padToGo / 2))
                    input = half + input + half
                    input = input.substr(0, padLength)
                }
            }
            return input
        },

        hexValueSanitize: function(color) {
            var red, green, blue;

            color = color.replace(/[^A-Z0-9]/ig, "")
            color = color.replace("#", "");
            if (color.length > 6) {
                color = color.substring(0, 6);
            }
            if (color.length == 6) {
                hex = color;
            } else {
                if (color.length > 3) {
                    color = color.substring(0, 3);
                }
                if (color.length == 3) {
                    red = color.substring(0, 1) + color.substring(0, 1);
                    green = color.substring(1, 1) + color.substring(1, 1);
                    blue = color.substring(2, 1) + color.substring(2, 1);

                    hex = red + green + blue;
                }
                if (color.length == 2) {
                    hex == color + color + color;
                }
                if (color.length == 1) {
                    hex == color + color + color + color + color + color;
                }
            }
            return '#' + hex;
        },

        hexToDec: function(hex) {
            hex = (hex + '').replace(/[^a-f0-9]/gi, '')
            return parseInt(hex, 16)
        },

        decToHex: function(number) {
            if (number < 0) {
                number = 0xFFFFFFFF + number + 1;
            }
            return parseInt(number, 10).toString(16);
        },

        hexToRgb: function(hex) {
            var red, green, blue;
            var rgb = [];

            hex = hex.replace('#', '');
            hex = this.hexValueSanitize(hex);
            if (hex.length == 3) {
                red = this.hexToDec(hex.substring(0, 1) + hex.substring(0, 1));
                green = this.hexToDec(hex.substring(1, 1) + hex.substring(1, 1));
                blue = this.hexToDec(hex.substring(2, 1) + hex.substring(2, 1));
            } else {
                red = this.hexToDec(hex.substring(0, 2));
                green = this.hexToDec(hex.substring(2, 4));
                blue = this.hexToDec(hex.substring(4, 6));
            }
            rgb.push(red, green, blue);

            return rgb;
        },
        hexBrightness: function(hex) {
            var red, green, blue;

            hex = this.hexValueSanitize(hex);
            hex = hex.replace('#', '');

            red = this.hexToDec(hex.substring(0, 2));
            green = this.hexToDec(hex.substring(2, 4));
            blue = this.hexToDec(hex.substring(4, 6));

            return ((red * 299) + (green * 587) + (blue * 114)) / 1000;
        },
        rgbToHsv: function(color) {
            var r = color[0];
            var g = color[1];
            var b = color[2];

            var h, s, v, min, max, del, dR, dG, dB;

            hsl = [];

            r = (r / 255);
            g = (g / 255);
            b = (b / 255);

            min = Math.min(r, g, b);
            max = Math.max(r, g, b);
            del = max - min;

            v = max;

            if (del == 0) {
                h = 0;
                s = 0;
            } else {
                s = del / max;

                dR = (((max - r) / 6) + (del / 2)) / del;
                dG = (((max - g) / 6) + (del / 2)) / del;
                dB = (((max - b) / 6) + (del / 2)) / del;

                if (r == max) {
                    h = dB - dG;
                } else if (g == max) {
                    h = (1 / 3) + dR - dB;
                } else if (b == max) {
                    h = (2 / 3) + dG - dR;
                }

                if (h < 0) {
                    h++;
                }

                if (h > 1) {
                    h--;
                }
            }

            hsl['h'] = h;
            hsl['s'] = s;
            hsl['v'] = v;

            return hsl;
        },
        hexToHsv: function(hex) {
            var rgb, hsv;

            hex = this.hexValueSanitize(hex);
            hex = hex.replace('#', '');

            rgb = this.hexToRgb(hex);
            hsv = this.rgbToHsv(rgb);

            return hsv;
        },
        mostBrightColor: function(colors) {
            var mostBright = false;
            var color, hex, brightness;

            for (i = 0; i < colors.length; i++) {
                color = this.hexValueSanitize(colors[i]);
                hex = color.replace('#', '');

                brightness = this.hexBrightness(hex);
                if (!mostBright || this.hexBrightness(hex) > this.hexBrightness(mostBright)) {
                    mostBright = hex;
                }

            }
            return '#' + mostBright;
        },
        mostSaturatedColor: function(colors) {
            var mostSaturated = false;
            var color, hex, hsv, saturation, oldHsv;

            for (i = 0; i < colors.length; i++) {
                color = this.hexValueSanitize(colors[i]);
                hex = color.replace('#', '');
                hsv = this.hexToHsv(hex);

                saturation = hsv['s'];

                if (mostSaturated) {
                    oldHsv = this.hexToHsv(mostSaturated);
                }

                if (!mostSaturated || saturation > oldHsv['s']) {
                    mostSaturated = hex;
                }
            }
            return '#' + mostSaturated;
        },
        brightestDullColor: function(colors) {
            var brightestDull = false;
            var color, hex, hsv, brightness, howDull, howDullOld, hsvOld;

            for (i = 0; i < colors.length; i++) {
                color = this.hexValueSanitize(colors[i]);
                hex = color.replace('#', '');
                hsv = this.hexToHsv(hex);

                brightness = this.hexBrightness(hex);
                hsv['s'] = (hsv['s'] == 0) ? 0.0001 : hsv['s'];
                howDull = 1 / hsv['s'];

                if (brightestDull) {
                    oldHsv = this.hexToHsv(brightestDull);
                    oldHsv['s'] = (oldHsv['s'] == 0) ? 0.0001 : oldHsv['s'];
                    howDullOld = 1 / oldHsv['s'];
                }

                if (!brightestDull || this.hexBrightness(hex) * howDull > this.hexBrightness(brightestDull) * howDullOld) {
                    brightestDull = hex;
                }
            }
            return '#' + brightestDull;
        },
        colorMixer: function(hex1, hex2, percent) {
            var r1, r2, g1, g2, b1, b2;
            hex1 = this.hexValueSanitize(hex1);
            hex2 = this.hexValueSanitize(hex2);

            hex1 = hex1.replace('#', '');
            if (hex1.length == 3) {
                hex1 = hex1.repeat(hex1.substr(0, 1), 2) + hex1.repeat(hex1.substr(1, 2), 2) + hex1.repeat(hex1.substr(2, 3), 2);
            }

            hex2 = hex2.replace('#', '');
            if (hex2.length == 3) {
                hex2 = hex2.repeat(hex2.substr(0, 1), 2) + hex2.repeat(hex2.substr(1, 2), 2) + hex2.repeat(hex2.substr(2, 3), 2);
            }

            r1 = this.hexToDec(hex1.substr(0, 2));
            g1 = this.hexToDec(hex1.substr(2, 2));
            b1 = this.hexToDec(hex1.substr(4, 2));

            r2 = this.hexToDec(hex2.substr(0, 2));
            g2 = this.hexToDec(hex2.substr(2, 2));
            b2 = this.hexToDec(hex2.substr(4, 2));

            red = (percent * r1 + (100 - percent) * r2) / 100;
            green = (percent * g1 + (100 - percent) * g2) / 100;
            blue = (percent * b1 + (100 - percent) * b2) / 100;

            var red_hex = strPad(this.decToHex(red), 2, '0', 'STR_PAD_LEFT');
            var green_hex = strPad(this.decToHex(green), 2, '0', 'STR_PAD_LEFT');
            var blue_hex = strPad(this.decToHex(blue), 2, '0', 'STR_PAD_LEFT');

            return '#' + red_hex + green_hex + blue_hex;
        }
    }
    /*
    var colorArray = ["#516373", "#6c838c", "#f2e8c9", "#f2b999", "#f2f2f2"];

    console.log("bright", this.mostBrightColor(colorArray));
    console.log("saturated", this.mostSaturatedColor(colorArray));
    console.log("bright dull", this.brightestDullColor(colorArray));
    console.log("mix", this.colorMixer('#000000', '#FF0000', 65));
    */