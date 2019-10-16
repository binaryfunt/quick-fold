'use babel';

import QuickFold from '../lib/quick-fold';

describe('QuickFold package', () => {

    let editor, editorView, activationPromise;

    beforeEach(async () => {
        await atom.packages.activatePackage('language-javascript');
        await atom.workspace.open('sample.js');

        editor = atom.workspace.getActiveTextEditor();
        editorView = atom.views.getView(editor);
    });

    describe('when the specs are run', () => {
        it('opens the sample file', () => {
            expect(!editor.isEmpty()).toBe(true);
        });
    });

    describe('when the quick-fold:fold-next event is triggered', () => {
        beforeEach(async () => {
            atom.commands.dispatch(editorView, 'quick-fold:fold-next');
            await atom.packages.activatePackage('quick-fold');
        });

        it('activates the package', () => {
            atom.commands.dispatch(editorView, 'quick-fold:fold-next');
            expect(atom.packages.isPackageActive('quick-fold')).toBe(true);
        });

        it('moves the cursor to a different line number', () => {
            atom.commands.dispatch(editorView, 'quick-fold:fold-next');
            console.log(atom.packages.isPackageActive('quick-fold'));
            expect(editor.getCursorScreenPosition().row).not.toBe(0);
        });
    });
});
