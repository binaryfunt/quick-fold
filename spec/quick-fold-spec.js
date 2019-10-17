describe('QuickFold package', () => {

    let editor, editorView, activationPromise;

    const foldNext = async () => {
        atom.commands.dispatch(editorView, 'quick-fold:fold-next');
        await activationPromise;
    };

    beforeEach(async () => {
        await atom.packages.activatePackage('language-javascript');
        await atom.workspace.open('sample.js');

        runs(() => {
            editor = atom.workspace.getActiveTextEditor();
            editorView = atom.views.getView(editor);

            return activationPromise = atom.packages.activatePackage('quick-fold');
        });
    });

    describe('when the specs are run', () => {
        it('opens the sample file', () => expect(!editor.isEmpty()).toBe(true));
    });

    describe('when the quick-fold:fold-next event is triggered', () => {
        it('activates the package', () => {
            return foldNext().then(() => expect(atom.packages.isPackageActive('quick-fold')).toBe(true));
        });

        it('moves the cursor to a different line number', () => {
            return foldNext().then(() => expect(editor.getCursorScreenPosition().row).not.toBe(0));
        });
    });
});
