<script>
  import { onMount, getContext, tick } from "svelte";
  import Header from "../misc/Header.svelte";
  import { t } from "../../i18n/lang";

  const appSettings = getContext("appSettings");

  const langComponents = {
    en: async (_) => await import("../langs/En.svelte"),
    afr: async (_) => await import("../langs/Afr.svelte"),
    zul: async (_) => await import("../langs/Zul.svelte"),
    spa: async (_) => await import("../langs/Spa.svelte"),
    fra: async (_) => await import("../langs/Fra.svelte"),
    por: async (_) => await import("../langs/Por.svelte"),
  };

  let Lang;
  let scrollContainer;
  let contentContainer;
  let headings = [];
  let activeId = "";

  const getLang = async (_) => {
    const loader = langComponents[$appSettings.lang] || langComponents["en"];
    const result = await loader();
    Lang = result.default;
    await tick();
    extractHeadings();
  };

  function extractHeadings() {
    headings = [];
    if (!contentContainer) return;
    const elements = contentContainer.querySelectorAll("h3, h5");
    const counts = {};

    elements.forEach((el, index) => {
      let id = el.id;
      if (!id) {
        let baseSlug = el.textContent
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        if (!baseSlug) baseSlug = `section-${index}`;
        counts[baseSlug] = (counts[baseSlug] || 0) + 1;
        id = counts[baseSlug] > 1 ? `${baseSlug}-${counts[baseSlug]}` : baseSlug;
        el.id = id;
      }
      const level = parseInt(el.tagName.replace("H", ""), 10);
      headings.push({
        id,
        text: el.textContent.trim(),
        level,
        el,
      });
    });
    headings = headings;

    if (headings.length > 0) {
      activeId = headings[0].id;
    }
  }

  function handleScroll() {
    if (!scrollContainer || headings.length === 0) return;
    const containerTop = scrollContainer.getBoundingClientRect().top;
    let currentActive = headings[0].id;

    for (const heading of headings) {
      if (heading.el) {
        const top = heading.el.getBoundingClientRect().top - containerTop;
        if (top <= 100) {
          currentActive = heading.id;
        } else {
          break;
        }
      }
    }
    activeId = currentActive;
  }

  function scrollToHeading(id) {
    activeId = id;
    const targetEl = document.getElementById(id);
    if (targetEl && scrollContainer) {
      const targetTop = targetEl.getBoundingClientRect().top;
      const containerTop = scrollContainer.getBoundingClientRect().top;
      const offset = targetTop - containerTop + scrollContainer.scrollTop - 16;
      scrollContainer.scrollTo({
        top: offset,
        behavior: "smooth",
      });
    }
  }

  onMount(getLang);

  $: if ($appSettings.lang) {
    getLang();
  }
</script>

<div class="h-screen flex flex-col overflow-hidden bg-white text-slate-800">
  <Header />
  <div
    class="flex-1 min-h-0 w-full max-w-[1280px] mx-auto flex py-6 px-6 gap-8 overflow-hidden"
  >
    <!-- Main scrollable documentation content -->
    <main
      bind:this={scrollContainer}
      class="flex-1 overflow-y-auto pr-6 scroll-smooth"
      on:scroll={handleScroll}
    >
      {#if Lang}
        <div bind:this={contentContainer} class="max-w-[850px] pb-12">
          <svelte:component this={Lang} />
        </div>
      {/if}
    </main>

    <!-- Right-side Table of Contents / Index sidebar -->
    {#if headings.length > 0}
      <aside
        class="hidden lg:block w-72 flex-shrink-0 overflow-y-auto border-l border-slate-200 pl-6 py-2"
      >
        <div
          class="sticky top-0 bg-white pb-2 mb-2 font-semibold text-xs uppercase tracking-wider text-slate-500 border-b border-slate-100"
        >
          {$t("onThisPage", "On this page")}
        </div>
        <nav class="space-y-1 text-sm">
          {#each headings as heading}
            <a
              href={`#${heading.id}`}
              class="block py-1 px-2 leading-snug transition-colors duration-150 rounded {heading.level === 5 ? 'ml-3 text-xs' : 'font-medium'} {activeId === heading.id ? 'bg-[#7c53ac]/10 !text-[#7c53ac] font-bold' : '!text-slate-600 hover:!text-[#7c53ac] hover:bg-slate-50'}"
              on:click|preventDefault={() => scrollToHeading(heading.id)}
            >
              {heading.text}
            </a>
          {/each}
        </nav>
      </aside>
    {/if}
  </div>
</div>
