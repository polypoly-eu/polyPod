import React, { useState } from "react";
import { Chips } from "@polypoly-eu/poly-look";
import { PolyChart } from "@polypoly-eu/poly-look";

const jurisdictionColors = {
    "EU-GDPR": "#60E6DE",
    "Five-Eyes": "#EC453D",
    Russia: "#FE8988",
    China: "#C5271E",
    Sonstige: "#A9B6C6",
};

const transparent = "rbga(0, 0, 0, 0)";

const inactiveLabelOpacity = 0.3;

const gradients = Object.entries(jurisdictionColors).map(
    ([jurisdiction, color]) => ({
        id: jurisdiction + "-gradient",
        type: "linearGradient",
        stops: [
            { offset: "0%", color, opacity: 0.2 },
            { offset: "100%", color, opacity: 1 },
        ],
    })
);

function linksToGroups(links) {
    return {
        sources: [...new Set(links.map((e) => e.source))],
        targets: [...new Set(links.map((e) => e.target))],
    };
}

const EmbeddedSankey = ({ links, groups }) => {
    const { sources, targets } = linksToGroups(links);
    const [activeSources, setActiveSources] = useState(
        groups?.source?.all ? sources : [sources[0]]
    );
    const [activeTargets, setActiveTargets] = useState(
        groups?.target?.all ? targets : [targets[0]]
    );

    const handleActiveSourceChange = (source) => {
        if (source === "all") setActiveSources(sources);
        else if (source === "others") setActiveSources(groups.source.others);
        else setActiveSources([source]);
    };

    const handleActiveTargetChange = (target) => {
        if (target === "all") setActiveTargets(targets);
        else if (target === "others")
            return setActiveTargets(groups.target.others);
        setActiveTargets([target]);
    };

    const isPathActive = (d) =>
        activeSources.indexOf(d.source.id) !== -1 &&
        activeTargets.indexOf(d.target.id) !== -1;

    function addGroupingChips(array, group) {
        let newArray = [...array];
        if (group?.all) newArray.push({ id: "all", translation: "All" });
        if (group?.others) {
            newArray.push({ id: "others", translation: "Other" });
            return newArray.filter((e) => group.others.indexOf(e) === -1);
        }
        return newArray;
    }

    const displayedSourceChips = addGroupingChips(sources, groups?.source);
    const displayedTargetChips = addGroupingChips(targets, groups?.target);

    const sankeyColors = {
        linkOpacity: "1",
        link: (d) =>
            isPathActive(d) ? `url(#${d.target.id}-gradient)` : transparent,
        textOpacity: (d) => (activeValue(d) > 0 ? 1 : inactiveLabelOpacity),
        nodeLabelBoxOpacity: (d) =>
            activeValue(d) > 0 ? 1 : inactiveLabelOpacity,
    };
    const activeValue = (d) =>
        links
            .filter(
                (link) =>
                    activeSources.indexOf(link.source) !== -1 &&
                    activeTargets.indexOf(link.target) !== -1 &&
                    (link.target == d.id || link.source == d.id)
            )
            .reduce((prev, curr) => prev.value || prev + curr.value, 0);

    const nodeLabel = {
        source: (d) => `${d.id}: ${activeValue(d)}`,
        target: (d) => `${d.id}: ${activeValue(d)}`,
    };
    return (
        <div className="embedded-sankey">
            <PolyChart
                type="sankey-diagram"
                links={links}
                className="full-size-svg"
                color={sankeyColors}
                gradients={gradients}
                nodeLabel={nodeLabel}
            />
            <p>{groups.source.label}</p>
            <Chips
                chipsContent={displayedSourceChips}
                activeChips={activeSources.length > 1 ? "all" : activeSources}
                onChipClick={handleActiveSourceChange}
            />
            <p>{groups.target.label}</p>
            <Chips
                chipsContent={displayedTargetChips}
                activeChips={
                    activeTargets.length > 1 ? "others" : activeTargets
                }
                onChipClick={handleActiveTargetChange}
            />
        </div>
    );
};

export default EmbeddedSankey;
