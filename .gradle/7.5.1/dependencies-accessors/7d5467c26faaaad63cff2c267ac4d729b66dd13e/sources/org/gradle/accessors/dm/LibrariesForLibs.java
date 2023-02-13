package org.gradle.accessors.dm;

import org.gradle.api.NonNullApi;
import org.gradle.api.artifacts.MinimalExternalModuleDependency;
import org.gradle.plugin.use.PluginDependency;
import org.gradle.api.artifacts.ExternalModuleDependencyBundle;
import org.gradle.api.artifacts.MutableVersionConstraint;
import org.gradle.api.provider.Provider;
import org.gradle.api.provider.ProviderFactory;
import org.gradle.api.internal.catalog.AbstractExternalDependencyFactory;
import org.gradle.api.internal.catalog.DefaultVersionCatalog;
import java.util.Map;
import javax.inject.Inject;

/**
 * A catalog of dependencies accessible via the `libs` extension.
*/
@NonNullApi
public class LibrariesForLibs extends AbstractExternalDependencyFactory {

    private final AbstractExternalDependencyFactory owner = this;
    private final ArrowLibraryAccessors laccForArrowLibraryAccessors = new ArrowLibraryAccessors(owner);
    private final CoroutinesLibraryAccessors laccForCoroutinesLibraryAccessors = new CoroutinesLibraryAccessors(owner);
    private final KotestLibraryAccessors laccForKotestLibraryAccessors = new KotestLibraryAccessors(owner);
    private final KotlinLibraryAccessors laccForKotlinLibraryAccessors = new KotlinLibraryAccessors(owner);
    private final KotlinxLibraryAccessors laccForKotlinxLibraryAccessors = new KotlinxLibraryAccessors(owner);
    private final VersionAccessors vaccForVersionAccessors = new VersionAccessors(providers, config);
    private final BundleAccessors baccForBundleAccessors = new BundleAccessors(providers, config);
    private final PluginAccessors paccForPluginAccessors = new PluginAccessors(providers, config);

    @Inject
    public LibrariesForLibs(DefaultVersionCatalog config, ProviderFactory providers) {
        super(config, providers);
    }

    /**
     * Returns the group of libraries at arrow
     */
    public ArrowLibraryAccessors getArrow() { return laccForArrowLibraryAccessors; }

    /**
     * Returns the group of libraries at coroutines
     */
    public CoroutinesLibraryAccessors getCoroutines() { return laccForCoroutinesLibraryAccessors; }

    /**
     * Returns the group of libraries at kotest
     */
    public KotestLibraryAccessors getKotest() { return laccForKotestLibraryAccessors; }

    /**
     * Returns the group of libraries at kotlin
     */
    public KotlinLibraryAccessors getKotlin() { return laccForKotlinLibraryAccessors; }

    /**
     * Returns the group of libraries at kotlinx
     */
    public KotlinxLibraryAccessors getKotlinx() { return laccForKotlinxLibraryAccessors; }

    /**
     * Returns the group of versions at versions
     */
    public VersionAccessors getVersions() { return vaccForVersionAccessors; }

    /**
     * Returns the group of bundles at bundles
     */
    public BundleAccessors getBundles() { return baccForBundleAccessors; }

    /**
     * Returns the group of plugins at plugins
     */
    public PluginAccessors getPlugins() { return paccForPluginAccessors; }

    public static class ArrowLibraryAccessors extends SubDependencyFactory {
        private final ArrowFxLibraryAccessors laccForArrowFxLibraryAccessors = new ArrowFxLibraryAccessors(owner);

        public ArrowLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

            /**
             * Creates a dependency provider for core (io.arrow-kt:arrow-core)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getCore() { return create("arrow.core"); }

            /**
             * Creates a dependency provider for optics (io.arrow-kt:arrow-optics)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getOptics() { return create("arrow.optics"); }

        /**
         * Returns the group of libraries at arrow.fx
         */
        public ArrowFxLibraryAccessors getFx() { return laccForArrowFxLibraryAccessors; }

    }

    public static class ArrowFxLibraryAccessors extends SubDependencyFactory {

        public ArrowFxLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

            /**
             * Creates a dependency provider for coroutines (io.arrow-kt:arrow-fx-coroutines)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getCoroutines() { return create("arrow.fx.coroutines"); }

    }

    public static class CoroutinesLibraryAccessors extends SubDependencyFactory {

        public CoroutinesLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

            /**
             * Creates a dependency provider for core (org.jetbrains.kotlinx:kotlinx-coroutines-core)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getCore() { return create("coroutines.core"); }

    }

    public static class KotestLibraryAccessors extends SubDependencyFactory {
        private final KotestAssertionsLibraryAccessors laccForKotestAssertionsLibraryAccessors = new KotestAssertionsLibraryAccessors(owner);
        private final KotestFrameworkLibraryAccessors laccForKotestFrameworkLibraryAccessors = new KotestFrameworkLibraryAccessors(owner);
        private final KotestRunnerLibraryAccessors laccForKotestRunnerLibraryAccessors = new KotestRunnerLibraryAccessors(owner);

        public KotestLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

            /**
             * Creates a dependency provider for property (io.kotest:kotest-property)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getProperty() { return create("kotest.property"); }

        /**
         * Returns the group of libraries at kotest.assertions
         */
        public KotestAssertionsLibraryAccessors getAssertions() { return laccForKotestAssertionsLibraryAccessors; }

        /**
         * Returns the group of libraries at kotest.framework
         */
        public KotestFrameworkLibraryAccessors getFramework() { return laccForKotestFrameworkLibraryAccessors; }

        /**
         * Returns the group of libraries at kotest.runner
         */
        public KotestRunnerLibraryAccessors getRunner() { return laccForKotestRunnerLibraryAccessors; }

    }

    public static class KotestAssertionsLibraryAccessors extends SubDependencyFactory {

        public KotestAssertionsLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

            /**
             * Creates a dependency provider for core (io.kotest:kotest-assertions-core)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getCore() { return create("kotest.assertions.core"); }

    }

    public static class KotestFrameworkLibraryAccessors extends SubDependencyFactory {

        public KotestFrameworkLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

            /**
             * Creates a dependency provider for engine (io.kotest:kotest-framework-engine)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getEngine() { return create("kotest.framework.engine"); }

    }

    public static class KotestRunnerLibraryAccessors extends SubDependencyFactory {

        public KotestRunnerLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

            /**
             * Creates a dependency provider for junit (io.kotest:kotest-runner-junit5)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getJunit() { return create("kotest.runner.junit"); }

    }

    public static class KotlinLibraryAccessors extends SubDependencyFactory {

        public KotlinLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

            /**
             * Creates a dependency provider for stdlib (org.jetbrains.kotlin:kotlin-stdlib)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getStdlib() { return create("kotlin.stdlib"); }

    }

    public static class KotlinxLibraryAccessors extends SubDependencyFactory {

        public KotlinxLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

            /**
             * Creates a dependency provider for knit (org.jetbrains.kotlinx:kotlinx-knit)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getKnit() { return create("kotlinx.knit"); }

    }

    public static class VersionAccessors extends VersionFactory  {

        public VersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

            /**
             * Returns the version associated to this alias: arrow (1.1.6-alpha.26)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getArrow() { return getVersion("arrow"); }

            /**
             * Returns the version associated to this alias: coroutines (1.6.4)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getCoroutines() { return getVersion("coroutines"); }

            /**
             * Returns the version associated to this alias: knit (0.4.0)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getKnit() { return getVersion("knit"); }

            /**
             * Returns the version associated to this alias: kotest (5.5.4)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getKotest() { return getVersion("kotest"); }

            /**
             * Returns the version associated to this alias: kotlin (1.8.10)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getKotlin() { return getVersion("kotlin"); }

    }

    public static class BundleAccessors extends BundleFactory {

        public BundleAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

    }

    public static class PluginAccessors extends PluginFactory {
        private final KotlinPluginAccessors baccForKotlinPluginAccessors = new KotlinPluginAccessors(providers, config);
        private final KotlinxPluginAccessors baccForKotlinxPluginAccessors = new KotlinxPluginAccessors(providers, config);

        public PluginAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

        /**
         * Returns the group of bundles at plugins.kotlin
         */
        public KotlinPluginAccessors getKotlin() { return baccForKotlinPluginAccessors; }

        /**
         * Returns the group of bundles at plugins.kotlinx
         */
        public KotlinxPluginAccessors getKotlinx() { return baccForKotlinxPluginAccessors; }

    }

    public static class KotlinPluginAccessors extends PluginFactory {

        public KotlinPluginAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

            /**
             * Creates a plugin provider for kotlin.jvm to the plugin id 'org.jetbrains.kotlin.jvm'
             * This plugin was declared in catalog libs.versions.toml
             */
            public Provider<PluginDependency> getJvm() { return createPlugin("kotlin.jvm"); }

    }

    public static class KotlinxPluginAccessors extends PluginFactory {

        public KotlinxPluginAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

            /**
             * Creates a plugin provider for kotlinx.knit to the plugin id 'org.jetbrains.kotlinx.knit'
             * This plugin was declared in catalog libs.versions.toml
             */
            public Provider<PluginDependency> getKnit() { return createPlugin("kotlinx.knit"); }

    }

}
