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

    describe('when the quick-fold:fold-next event is triggered once', () => {
        beforeEach(async () => {
            await foldNext();
        });

        it('activates the package', () => expect(atom.packages.isPackageActive('quick-fold')).toBe(true));

        it('moves the cursor to line 3', () => expect(editor.getCursorScreenPosition().row + 1).toBe(3));

        it('has folded line 3', () => expect(editor.isFoldedAtCursorRow()).toBe(true));
    });

    describe('when the quick-fold:fold-next event is triggered twice', () => {
        beforeEach(async () => {
            await foldNext();
            await foldNext();
        });

        it('moves the cursor to buffer line 8 / screen line 5', () => expect(editor.getCursorBufferPosition().row + 1).toBe(8));

        it('has folded buffer line 8', () => expect(editor.isFoldedAtCursorRow()).toBe(true));
    });

    describe('when the quick-fold:fold-next event is triggered on buffer line 8', () => {
        beforeEach(async () => {
            editor.setCursorBufferPosition([8 - 1, 0]);
            await foldNext();
        });

        it('leaves the cursor on buffer line 8', () => expect(editor.getCursorBufferPosition().row + 1).toBe(8));

        it('has folded buffer line 8', () => expect(editor.isFoldedAtCursorRow()).toBe(true));
    });

    describe('when the quick-fold:fold-next event is triggered on buffer line 9', () => {
        beforeEach(async () => {
            editor.setCursorBufferPosition([9 - 1, 0]);
            await foldNext();
        });

        it('moves the cursor to buffer line 11', () => expect(editor.getCursorBufferPosition().row + 1).toBe(11));

        it('has folded buffer line 11', () => expect(editor.isFoldedAtCursorRow()).toBe(true));
    });

    describe('when the quick-fold:fold-next event is triggered on buffer line 22', () => {
        beforeEach(async () => {
            editor.setCursorBufferPosition([22 - 1, 0]);
            await foldNext();
        });

        it('has not folded the line the cursor arrives on', () => expect(!editor.isFoldedAtCursorRow()).toBe(true));

        it('leaves the number of screen lines unchanged', () => expect(editor.getScreenLineCount()).toBe(editor.getLineCount()));
    });
});
