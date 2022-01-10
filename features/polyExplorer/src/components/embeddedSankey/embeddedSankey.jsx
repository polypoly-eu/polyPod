import React, { useState } from "react";
import { ChipGroup, PolyChart } from "@polypoly-eu/poly-look";

const jurisdictionColors = {
    "EU-GDPR": "#60E6DE",
    "Five-Eyes": "#EC453D",
    Russia: "#EC453D",
    China: "#EC453D",
    Sonstige: "#EC453D",
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
    const [activeSources, setActiveSources] = useState(sources);
    const [activeTargets, setActiveTargets] = useState(targets);

    const handleActiveSourceChange = (_, activeChips) => {
        setActiveSources(activeChips);
    };

    const handleActiveTargetChange = (_, activeChips) => {
        setActiveTargets(activeChips);
    };

    const isPathActive = (d) =>
        activeSources.indexOf(d.source.id) !== -1 &&
        activeTargets.indexOf(d.target.id) !== -1;

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
            <ChipGroup
                chipsContent={sources}
                defaultActiveChips={
                    activeSources.length > 1 ? ["all"] : activeSources
                }
                onChipClick={handleActiveSourceChange}
                exclusive={false}
                allChip={groups.source.all ? { translation: "All" } : null}
                othersChip={
                    groups.source.others
                        ? {
                              translation: "others",
                              ids: groups.source.others,
                              exclusive: false,
                          }
                        : null
                }
            />
            <p>{groups.target.label}</p>
            <ChipGroup
                chipsContent={targets}
                defaultActiveChips={[...targets, "others"]}
                onChipClick={handleActiveTargetChange}
                exclusive={false}
                allChip={groups.target.all ? { translation: "All" } : null}
                othersChip={
                    groups.target.others
                        ? {
                              translation: "Others",
                              ids: groups.target.others,
                              exclusive: false,
                          }
                        : null
                }
            />
        </div>
    );
};

export default EmbeddedSankey;
