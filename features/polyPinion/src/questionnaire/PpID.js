//
// Global ID allocation for Questionnaire components
//
// Ideally, once the questionnaire goes public, any changes to 
// questions, e.g. different choices of words, emphasis, etc.,
// should be tracked so that the impact from those changes
// can be properly tracked and analysed.
//
// Having central allocation of IDs allows this to be set up.
//
// Curently the ID starts at the default value each time the program
// is run, however it can be loaded from a central store to
// properly provide IDs.
//

var nextGId = 1;

function nextGlobalId() {
    return nextGId++;
}

function currentGlobalId() {
    return nextGId;
}

function initializeGlobalId(an_integer) {
    nextGid = an_integer
}

export {nextGlobalId, currentGlobalId, initializeGlobalId};
