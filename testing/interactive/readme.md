These files were originally in webapp/testing.

Most of these were used to create and develop components especially for the PanelBuilder.

Many of these tests use Dojo and so are out-of-date for the current
project direction of using Mithril Several of these tests were
experiments. Most or all probably will not work in this new location
without adjustments to script loading URLs. In general, some may not
work unless copied back to run under webapp and be served from the same
origin as the APIs to talk to the server. Despite breaking them, moving
them out from under webapp hopefully will reduce confusion for new
developers just looking at that code and seeing obsolete experiments and
tests in that directory.
