# furigana_annotator
a script to inject furigana into a page

## Development

I test this locally by running

 python -m http.server

 and navigating to

 [http://127.0.0.1:8000/dist/example.html](http://127.0.0.1:8000/dist/example.html)

## Notes

Please download the contents of the `dict/` folder in the [kuromoji project](https://github.com/takuyaa/kuromoji.js/).

The path to those contents will need to be passed to `addRubyAnnotationsToPage()`. Warning, loading can take some time (~5s).

Please see ./dist/example.html for example usage.
