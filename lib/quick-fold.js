'use babel';

import QuickFoldView from './quick-fold-view';
import { CompositeDisposable } from 'atom';

export default {

    subscriptions: null,

    activate(state) {
        /* This optional method is called when your package is activated. It is passed the state data from the last time the window was serialized if your module implements the serialize() method. Use this to do initialization work when your package is started (like setting up DOM elements or binding events). If this method returns a promise the package will be considered loading until the promise resolves (or rejects). */

        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();

        // Register command that toggles this view
        this.subscriptions.add(atom.commands.add('atom-text-editor', {
            'quick-fold:fold-next': () => this.foldNext()
        }));
    },

    deactivate() {
        /* This optional method is called when the window is shutting down and when the package is disabled. If your package is watching any files or holding external resources in any other way, release them here. You should also dispose of all subscriptions you're holding on to. */
        this.subscriptions.dispose();
    },

    foldNext() {
        var editor = atom.workspace.getActiveTextEditor();
        var screenLineCount = editor.getScreenLineCount();
        var screenLine = editor.getSelectedScreenRange().start.row;

        var isScreenLineFoldable = () => editor.isFoldableAtScreenRow(screenLine);
        var isScreenLineAlreadyFolded = () => editor.isFoldedAtScreenRow(screenLine);
        var screenRowToBufferRow = (screenRow) => editor.bufferPositionForScreenPosition([screenRow, 0]).row;

        while ((!isScreenLineFoldable() || isScreenLineAlreadyFolded()) && screenLine < screenLineCount) {
            screenLine++;
        }

        var bufferLine = screenRowToBufferRow(screenLine);
        editor.foldBufferRow(bufferLine);

        editor.setCursorScreenPosition([screenLine, 0], {autoscroll: false});
        editor.moveToEndOfLine();
        editor.scrollToCursorPosition({center: true});

        // TODO: Look into cases where soft wrap is turned off. Also, could not scroll if no foldable lines found
    }

};
