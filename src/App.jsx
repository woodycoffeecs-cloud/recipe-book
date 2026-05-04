import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from './supabase.js'
import { DEFAULT_RECIPES, CATEGORIES, EDIT_PASSWORD } from './data.js'

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
function deepClone(obj) { return JSON.parse(JSON.stringify(obj)) }

function CategoryBadge({ cat }) {
  const c = CATEGORIES[cat]
  if (!c) return null
  return (
    <span style={{
      fontFamily: "'DM Sans', sans-serif",
      fontWeight: 500,
      fontSize: '10px',
      letterSpacing: '0.12em',
      color: c.color,
      textTransform: 'uppercase',
    }}>{c.label}</span>
  )
}

// ─────────────────────────────────────────────────────────────
// LOCK ICON
// ─────────────────────────────────────────────────────────────
function LockIcon({ open }) {
  return open ? (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
    </svg>
  ) : (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────
// PASSWORD MODAL
// ─────────────────────────────────────────────────────────────
function PasswordModal({ onSuccess, onClose }) {
  const [val, setVal] = useState('')
  const [err, setErr] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const submit = () => {
    if (val === EDIT_PASSWORD) { onSuccess() }
    else { setErr(true); setVal(''); setTimeout(() => setErr(false), 1500) }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(26,26,24,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, backdropFilter: 'blur(4px)',
    }} onClick={onClose}>
      <div style={{
        background: '#F5F0E8', border: '1px solid #C8C0B0',
        padding: '40px', width: '320px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      }} onClick={e => e.stopPropagation()}>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', marginBottom: '6px' }}>
          Chế độ chỉnh sửa
        </p>
        <p style={{ fontSize: '12px', color: '#8A8A7A', marginBottom: '24px' }}>
          Nhập mật khẩu để chỉnh sửa công thức
        </p>
        <input
          ref={inputRef}
          type="password"
          value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="Mật khẩu..."
          style={{
            width: '100%', padding: '10px 12px',
            border: `1.5px solid ${err ? '#C0392B' : '#C8C0B0'}`,
            background: 'transparent', fontSize: '14px',
            fontFamily: "'DM Sans', sans-serif",
            outline: 'none', marginBottom: '16px',
            transition: 'border-color 180ms',
          }}
        />
        {err && <p style={{ fontSize: '11px', color: '#C0392B', marginTop: '-12px', marginBottom: '12px' }}>
          Sai mật khẩu
        </p>}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '10px', background: 'transparent',
            border: '1px solid #C8C0B0', cursor: 'pointer', fontSize: '13px',
            fontFamily: "'DM Sans', sans-serif",
          }}>Huỷ</button>
          <button onClick={submit} style={{
            flex: 1, padding: '10px', background: '#1A1A18', color: '#F5F0E8',
            border: 'none', cursor: 'pointer', fontSize: '13px',
            fontFamily: "'DM Sans', sans-serif",
          }}>Xác nhận</button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// EDITABLE TEXT — realtime save on blur
// ─────────────────────────────────────────────────────────────
function Editable({ value, onChange, isEditing, tag: Tag = 'span', style = {}, multiline = false }) {
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current && ref.current.textContent !== value) {
      ref.current.textContent = value
    }
  }, [value])

  if (!isEditing) return <Tag style={style}>{value}</Tag>

  return (
    <Tag
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onBlur={() => {
        const newVal = ref.current?.textContent || ''
        if (newVal !== value) onChange(newVal)
      }}
      onKeyDown={e => {
        if (!multiline && e.key === 'Enter') { e.preventDefault(); ref.current?.blur() }
      }}
      style={{ ...style, minWidth: '20px', display: multiline ? 'block' : 'inline' }}
    />
  )
}

// ─────────────────────────────────────────────────────────────
// RECIPE CARD — full detail view
// ─────────────────────────────────────────────────────────────
function RecipeCard({ recipe, isEditing, onUpdate }) {
  const cat = CATEGORIES[recipe.category] || CATEGORIES.MATCHA

  const updateField = (path, value) => {
    const updated = deepClone(recipe)
    const keys = path.split('.')
    let obj = updated
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i]
      const nextKey = keys[i + 1]
      if (!isNaN(nextKey)) { obj = obj[k] } else { obj = obj[k] }
    }
    obj[keys[keys.length - 1]] = value
    onUpdate(updated)
  }

  const updateIngredient = (sizeIdx, ingIdx, field, value) => {
    const updated = deepClone(recipe)
    updated.sizes[sizeIdx].ingredients[ingIdx][field] = value
    onUpdate(updated)
  }

  const updateStep = (stepIdx, value) => {
    const updated = deepClone(recipe)
    updated.steps[stepIdx] = value
    onUpdate(updated)
  }

  const addIngredient = (sizeIdx) => {
    const updated = deepClone(recipe)
    updated.sizes[sizeIdx].ingredients.push({ name: 'Nguyên liệu mới', amount: '0ml' })
    onUpdate(updated)
  }

  const removeIngredient = (sizeIdx, ingIdx) => {
    const updated = deepClone(recipe)
    updated.sizes[sizeIdx].ingredients.splice(ingIdx, 1)
    onUpdate(updated)
  }

  const addStep = () => {
    const updated = deepClone(recipe)
    updated.steps.push('Bước mới...')
    onUpdate(updated)
  }

  const removeStep = (stepIdx) => {
    const updated = deepClone(recipe)
    updated.steps.splice(stepIdx, 1)
    onUpdate(updated)
  }

  return (
    <div style={{
      background: '#FFFFFF',
      borderTop: `3px solid ${cat.color}`,
      padding: '32px',
      position: 'relative',
    }}>
      {/* Category + Name */}
      <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #E8E0D0' }}>
        <CategoryBadge cat={recipe.category} />
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(22px, 4vw, 32px)',
          fontWeight: 700,
          lineHeight: 1.1,
          marginTop: '4px',
          color: '#1A1A18',
        }}>
          <Editable
            value={recipe.name}
            onChange={v => updateField('name', v)}
            isEditing={isEditing}
            style={{ fontFamily: 'inherit', fontSize: 'inherit', fontWeight: 'inherit', color: 'inherit' }}
          />
        </h2>
      </div>

      {/* Ingredients */}
      <div style={{ marginBottom: '28px' }}>
        <p style={{
          fontSize: '9px', fontWeight: 500, letterSpacing: '0.15em',
          color: '#8A8A7A', textTransform: 'uppercase', marginBottom: '16px',
        }}>THÀNH PHẦN</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {recipe.sizes.map((size, si) => (
            <div key={si}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
                <span style={{
                  fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em',
                  color: cat.color,
                }}>
                  <Editable value={size.label} onChange={v => { const u = deepClone(recipe); u.sizes[si].label = v; onUpdate(u) }} isEditing={isEditing} />
                </span>
                <span style={{ fontSize: '10px', color: '#8A8A7A' }}>
                  <Editable value={size.ml} onChange={v => { const u = deepClone(recipe); u.sizes[si].ml = v; onUpdate(u) }} isEditing={isEditing} />
                </span>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {size.ingredients.map((ing, ii) => (
                    <tr key={ii} style={{ borderBottom: '1px solid #F0EAE0' }}>
                      <td style={{ padding: '7px 0', fontSize: '13px', color: '#2A2A22', width: '60%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {isEditing && (
                            <button onClick={() => removeIngredient(si, ii)} style={{
                              background: 'none', border: 'none', cursor: 'pointer',
                              color: '#C0392B', fontSize: '14px', lineHeight: 1, padding: '0 2px',
                              opacity: 0.6,
                            }}>×</button>
                          )}
                          <Editable value={ing.name} onChange={v => updateIngredient(si, ii, 'name', v)} isEditing={isEditing} />
                        </div>
                      </td>
                      <td style={{ padding: '7px 0', fontSize: '13px', fontWeight: 600, color: '#1A1A18', textAlign: 'right' }}>
                        <Editable value={ing.amount} onChange={v => updateIngredient(si, ii, 'amount', v)} isEditing={isEditing} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {isEditing && (
                <button onClick={() => addIngredient(si)} style={{
                  marginTop: '8px', background: 'none', border: `1px dashed ${cat.accent}`,
                  color: cat.color, cursor: 'pointer', fontSize: '11px', padding: '4px 10px',
                  fontFamily: "'DM Sans', sans-serif", width: '100%',
                }}>+ Thêm nguyên liệu</button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div style={{ borderTop: '1px solid #E8E0D0', paddingTop: '20px' }}>
        <p style={{
          fontSize: '9px', fontWeight: 500, letterSpacing: '0.15em',
          color: '#8A8A7A', textTransform: 'uppercase', marginBottom: '16px',
        }}>CÁCH LÀM</p>

        <ol style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {recipe.steps.map((step, si) => (
            <li key={si} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <span style={{
                minWidth: '20px', height: '20px', borderRadius: '50%',
                background: cat.color, color: '#fff',
                fontSize: '11px', fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginTop: '1px', flexShrink: 0,
              }}>{si + 1}</span>
              <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <Editable
                  value={step}
                  onChange={v => updateStep(si, v)}
                  isEditing={isEditing}
                  tag="p"
                  multiline
                  style={{ fontSize: '13px', lineHeight: 1.6, color: '#2A2A22', flex: 1 }}
                />
                {isEditing && (
                  <button onClick={() => removeStep(si)} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#C0392B', fontSize: '14px', opacity: 0.6, flexShrink: 0, marginTop: '2px',
                  }}>×</button>
                )}
              </div>
            </li>
          ))}
        </ol>

        {isEditing && (
          <button onClick={addStep} style={{
            marginTop: '12px', background: 'none', border: `1px dashed ${cat.accent}`,
            color: cat.color, cursor: 'pointer', fontSize: '11px', padding: '6px 14px',
            fontFamily: "'DM Sans', sans-serif",
          }}>+ Thêm bước</button>
        )}
      </div>

      {/* Footer */}
      <div style={{ marginTop: '24px', textAlign: 'right' }}>
        <span style={{ fontSize: '9px', color: '#C8C0B0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          RECIPE BOOK
        </span>
        <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: cat.dot || cat.color, marginLeft: '8px', verticalAlign: 'middle' }} />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// SIDEBAR — category + recipe list
// ─────────────────────────────────────────────────────────────
function Sidebar({ recipes, selected, onSelect, isEditing, onAddRecipe }) {
  const grouped = Object.keys(CATEGORIES).map(cat => ({
    cat,
    recipes: recipes.filter(r => r.category === cat),
  })).filter(g => g.recipes.length > 0)

  return (
    <nav style={{
      width: '240px', flexShrink: 0,
      background: '#EDEAE0',
      borderRight: '1px solid #C8C0B0',
      height: '100vh', overflowY: 'auto',
      position: 'sticky', top: 0,
    }}>
      {/* Header */}
      <div style={{ padding: '28px 20px 20px', borderBottom: '1px solid #C8C0B0' }}>
        <p style={{ fontSize: '9px', letterSpacing: '0.18em', color: '#8A8A7A', textTransform: 'uppercase', marginBottom: '4px' }}>
          HƯỚNG DẪN PHA CHẾ
        </p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 700, lineHeight: 1.2 }}>
          Recipe<br />Book
        </h1>
        <p style={{ fontSize: '10px', color: '#8A8A7A', marginTop: '6px' }}>
          {recipes.length} công thức · Size M & L
        </p>
      </div>

      {/* Groups */}
      <div style={{ padding: '12px 0' }}>
        {grouped.map(({ cat, recipes: catRecipes }) => {
          const c = CATEGORIES[cat]
          return (
            <div key={cat} style={{ marginBottom: '4px' }}>
              <div style={{
                padding: '8px 20px 6px',
                fontSize: '9px', fontWeight: 600, letterSpacing: '0.14em',
                color: c.color, textTransform: 'uppercase',
              }}>{c.label}</div>
              {catRecipes.map(r => (
                <button
                  key={r.id}
                  onClick={() => onSelect(r.id)}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '8px 20px 8px 28px',
                    background: selected === r.id ? '#FFFFFF' : 'transparent',
                    border: 'none', cursor: 'pointer',
                    fontSize: '13px', color: selected === r.id ? '#1A1A18' : '#4A4A42',
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: selected === r.id ? 500 : 400,
                    borderLeft: selected === r.id ? `2px solid ${c.color}` : '2px solid transparent',
                    transition: 'all 150ms',
                  }}
                >
                  {r.name}
                </button>
              ))}
            </div>
          )
        })}

        {isEditing && (
          <button onClick={onAddRecipe} style={{
            display: 'block', width: 'calc(100% - 24px)', margin: '12px auto 0',
            padding: '8px', background: 'transparent',
            border: '1px dashed #8A8A7A', cursor: 'pointer',
            fontSize: '12px', color: '#4A4A42',
            fontFamily: "'DM Sans', sans-serif",
          }}>+ Thêm món mới</button>
        )}
      </div>
    </nav>
  )
}

// ─────────────────────────────────────────────────────────────
// TOAST notification
// ─────────────────────────────────────────────────────────────
function Toast({ msg }) {
  if (!msg) return null
  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px',
      background: '#1A1A18', color: '#F5F0E8',
      padding: '10px 18px', fontSize: '12px',
      fontFamily: "'DM Sans', sans-serif",
      boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
      zIndex: 900, letterSpacing: '0.02em',
      animation: 'fadeIn 200ms ease',
    }}>{msg}</div>
  )
}

// ─────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────
export default function App() {
  const [recipes, setRecipes] = useState([])
  const [selected, setSelected] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showPwModal, setShowPwModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')
  const saveTimeout = useRef(null)
  const channelRef = useRef(null)

  // ── Show toast ─────────────────────────
  const showToast = (msg, duration = 2000) => {
    setToast(msg)
    setTimeout(() => setToast(''), duration)
  }

  // ── Load data from Supabase ────────────
  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from('recipes')
          .select('*')
          .order('sort_order', { ascending: true })

        if (error) throw error

        if (data && data.length > 0) {
          const parsed = data.map(row => ({ ...row.data, _rowId: row.id }))
          setRecipes(parsed)
          setSelected(parsed[0]?.id)
        } else {
          // First run: seed with default data
          await seedDefaultData()
        }
      } catch (err) {
        console.error('Load error:', err)
        // Fallback to local data if Supabase not configured
        setRecipes(DEFAULT_RECIPES)
        setSelected(DEFAULT_RECIPES[0]?.id)
        showToast('⚠️ Đang dùng dữ liệu cục bộ (chưa cấu hình Supabase)')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // ── Seed default data ──────────────────
  const seedDefaultData = async () => {
    try {
      const rows = DEFAULT_RECIPES.map((r, i) => ({
        recipe_id: r.id,
        sort_order: i,
        data: r,
      }))
      const { error } = await supabase.from('recipes').insert(rows)
      if (error) throw error
      setRecipes(DEFAULT_RECIPES)
      setSelected(DEFAULT_RECIPES[0]?.id)
    } catch (err) {
      console.error('Seed error:', err)
      setRecipes(DEFAULT_RECIPES)
      setSelected(DEFAULT_RECIPES[0]?.id)
    }
  }

  // ── Realtime subscription ──────────────
  useEffect(() => {
    channelRef.current = supabase
      .channel('recipes-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'recipes' }, (payload) => {
        if (payload.eventType === 'UPDATE') {
          setRecipes(prev => prev.map(r =>
            r.id === payload.new.data.id ? { ...payload.new.data, _rowId: payload.new.id } : r
          ))
        } else if (payload.eventType === 'INSERT') {
          setRecipes(prev => [...prev, { ...payload.new.data, _rowId: payload.new.id }])
        } else if (payload.eventType === 'DELETE') {
          setRecipes(prev => prev.filter(r => r._rowId !== payload.old.id))
        }
      })
      .subscribe()

    return () => { channelRef.current?.unsubscribe() }
  }, [])

  // ── Debounced save ─────────────────────
  const saveRecipe = useCallback(async (updated) => {
    setRecipes(prev => prev.map(r => r.id === updated.id ? updated : r))
    clearTimeout(saveTimeout.current)
    saveTimeout.current = setTimeout(async () => {
      setSaving(true)
      try {
        const { error } = await supabase
          .from('recipes')
          .update({ data: updated })
          .eq('recipe_id', updated.id)
        if (error) throw error
        showToast('✓ Đã lưu')
      } catch (err) {
        showToast('⚠️ Lỗi lưu dữ liệu')
      } finally {
        setSaving(false)
      }
    }, 800)
  }, [])

  // ── Add new recipe ─────────────────────
  const addRecipe = async () => {
    const id = `new-recipe-${Date.now()}`
    const newR = {
      id,
      name: 'Món mới',
      category: 'MATCHA',
      sizes: [
        { label: 'SIZE M', ml: '500ml', ingredients: [{ name: 'Nguyên liệu', amount: '0ml' }] },
        { label: 'SIZE L', ml: '700ml', ingredients: [{ name: 'Nguyên liệu', amount: '0ml' }] },
      ],
      steps: ['Bước 1...'],
    }
    try {
      const { error } = await supabase.from('recipes').insert({
        recipe_id: id,
        sort_order: recipes.length,
        data: newR,
      })
      if (error) throw error
      setRecipes(prev => [...prev, newR])
      setSelected(id)
    } catch {
      setRecipes(prev => [...prev, newR])
      setSelected(id)
    }
  }

  // ── Auth ───────────────────────────────
  const toggleEdit = () => {
    if (isEditing) { setIsEditing(false); return }
    setShowPwModal(true)
  }

  const currentRecipe = recipes.find(r => r.id === selected)

  // ── Render ─────────────────────────────
  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: '#F5F0E8',
        fontFamily: "'Playfair Display', serif", fontSize: '18px', color: '#8A8A7A',
      }}>
        Đang tải công thức...
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar
        recipes={recipes}
        selected={selected}
        onSelect={setSelected}
        isEditing={isEditing}
        onAddRecipe={addRecipe}
      />

      {/* Main content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Topbar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          padding: '14px 32px',
          borderBottom: '1px solid #E8E0D0',
          background: '#F5F0E8',
          gap: '12px',
          position: 'sticky', top: 0, zIndex: 10,
        }}>
          {saving && (
            <span style={{ fontSize: '11px', color: '#8A8A7A' }}>Đang lưu...</span>
          )}
          {isEditing && (
            <span style={{
              fontSize: '11px', color: '#2D6A4F', background: '#D8F3DC',
              padding: '3px 10px', letterSpacing: '0.05em',
            }}>
              CHẾ ĐỘ CHỈNH SỬA
            </span>
          )}
          <button
            onClick={toggleEdit}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '7px 14px',
              background: isEditing ? '#1A1A18' : 'transparent',
              color: isEditing ? '#F5F0E8' : '#4A4A42',
              border: `1px solid ${isEditing ? '#1A1A18' : '#C8C0B0'}`,
              cursor: 'pointer', fontSize: '12px',
              fontFamily: "'DM Sans', sans-serif",
              transition: 'all 180ms',
            }}
          >
            <LockIcon open={isEditing} />
            {isEditing ? 'Khoá lại' : 'Chỉnh sửa'}
          </button>
        </div>

        {/* Recipe content */}
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 32px' }}>
          {currentRecipe ? (
            <RecipeCard
              key={currentRecipe.id}
              recipe={currentRecipe}
              isEditing={isEditing}
              onUpdate={saveRecipe}
            />
          ) : (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              height: '300px', color: '#8A8A7A', fontSize: '14px',
            }}>Chọn công thức từ danh sách bên trái</div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showPwModal && (
        <PasswordModal
          onSuccess={() => { setIsEditing(true); setShowPwModal(false); showToast('✓ Đã mở chế độ chỉnh sửa') }}
          onClose={() => setShowPwModal(false)}
        />
      )}

      <Toast msg={toast} />

      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(4px) } to { opacity:1; transform:translateY(0) } }
        button { transition: opacity 150ms; }
        button:hover { opacity: 0.8; }
      `}</style>
    </div>
  )
}
