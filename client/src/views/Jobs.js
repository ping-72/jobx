import JobsMain from "../components/core/JobsMain";
import Nav from "../components/core/Nav";
import TrailJob from "../components/core/Trail_job/trailJob";


export default function Jobs() {
    return (
        <>
            <Nav />
            <JobsMain />
            <TrailJob/>
        </>
    );
}